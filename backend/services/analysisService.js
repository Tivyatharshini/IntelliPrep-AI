import { buildJdPrompt } from "../prompts/jdPrompt.js";
import { buildAtsPrompt } from "../prompts/atsPrompt.js";
import { buildSkillGapPrompt } from "../prompts/skillGapPrompt.js";
import { buildInterviewPrompt } from "../prompts/interviewPrompt.js";
import { buildEvaluationPrompt } from "../prompts/evaluationPrompt.js";
import { generateStructuredJson } from "./geminiService.js";
import { clampScore, extractKnownSkills, extractKeywords, normalizeText, splitLines, unique } from "../utils/textUtils.js";

const fallbackResources = {
  "Machine Learning": ["Andrew Ng Machine Learning Specialization", "Scikit-Learn documentation"],
  Python: ["Python official docs", "Real Python tutorials"],
  SQL: ["SQLBolt", "Mode SQL tutorial"],
  Statistics: ["Khan Academy statistics", "StatQuest"],
  React: ["React docs", "React Router docs"],
  "Node.js": ["Node.js docs", "Express docs"],
  Docker: ["Docker docs", "Play with Docker"],
  AWS: ["AWS Skill Builder", "AWS documentation"]
};

function roleFromText(text) {
  const lower = text.toLowerCase();
  const roleMap = [
    { role: "Data Scientist", patterns: [/data scientist/, /machine learning/, /statistics/, /python/, /pandas/] },
    { role: "Frontend Engineer", patterns: [/frontend/, /react/, /ui\//, /javascript/, /typescript/] },
    { role: "Backend Engineer", patterns: [/backend/, /api/, /node/, /express/, /microservice/] },
    { role: "Full Stack Engineer", patterns: [/full stack/, /full-stack/, /frontend.*backend/, /react.*node/] },
    { role: "Product Manager", patterns: [/product manager/, /roadmap/, /stakeholder/, /product/] },
    { role: "Data Analyst", patterns: [/data analyst/, /analytics/, /reporting/, /sql/] },
    { role: "DevOps Engineer", patterns: [/devops/, /kubernetes/, /docker/, /ci\/cd/, /cloud/] },
    { role: "Software Engineer", patterns: [/.*/] }
  ];

  for (const entry of roleMap) {
    if (entry.patterns.some((pattern) => pattern.test(lower))) {
      return entry.role;
    }
  }

  return "Software Engineer";
}

function extractExperience(text) {
  const match = text.match(/(\d+\s*(?:\+|plus)?\s*[-to]{0,3}\s*\d*\s*years?)/i)
    || text.match(/entry level|junior|mid level|mid-level|senior|lead|principal/i);
  return match ? match[0].replace(/\s+/g, " ") : "Not explicitly stated";
}

function extractEducation(text) {
  const educationLine = splitLines(text).find((line) => /bachelor|master|degree|education|computer science|engineering/i.test(line));
  return educationLine ? [educationLine] : [];
}

function extractResponsibilities(text) {
  const lines = splitLines(text);
  const bullets = lines.filter((line) => /^[-*•]/.test(line));
  const responsibilitySectionIndex = lines.findIndex((line) => /responsibilit|what you'll do|what you will do|day-to-day/i.test(line));

  if (bullets.length > 0) {
    return bullets.map((line) => line.replace(/^[-*•]\s*/, "")).slice(0, 8);
  }

  if (responsibilitySectionIndex >= 0) {
    return lines.slice(responsibilitySectionIndex + 1, responsibilitySectionIndex + 9).filter(Boolean).slice(0, 8);
  }

  return extractKeywords(text, 8).map((keyword) => `Work related to ${keyword}`);
}

function extractIndustry(text) {
  const industryMap = [
    { name: "FinTech", patterns: [/fintech|finance|bank|payments|lending|trading/i] },
    { name: "HealthTech", patterns: [/healthcare|health tech|medical|clinical|hospital/i] },
    { name: "E-commerce", patterns: [/e-commerce|ecommerce|marketplace|retail/i] },
    { name: "SaaS", patterns: [/saas|b2b|platform/i] },
    { name: "EdTech", patterns: [/edtech|education|learning platform/i] },
    { name: "AI / ML", patterns: [/machine learning|ai|artificial intelligence|llm/i] }
  ];

  for (const industry of industryMap) {
    if (industry.patterns.some((pattern) => pattern.test(text))) {
      return industry.name;
    }
  }

  return "General Technology";
}

function extractPreferredSkills(text, requiredSkills) {
  const lower = text.toLowerCase();
  const preferredSection = lower.includes("preferred") || lower.includes("nice to have") || lower.includes("bonus");
  const preferred = extractKnownSkills(preferredSection ? text : "").filter((skill) => !requiredSkills.includes(skill));
  return preferred.slice(0, 8);
}

function analyzeJobDescriptionFallback(jobDescription) {
  const text = normalizeText(jobDescription);
  const knownSkills = extractKnownSkills(text);
  const requiredSkills = (
    knownSkills.length > 0
      ? knownSkills
      : extractKeywords(text, 8).map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  ).slice(0, 12);
  const role = roleFromText(text);

  return {
    role,
    requiredSkills,
    preferredSkills: extractPreferredSkills(text, requiredSkills),
    experienceRequired: extractExperience(text),
    educationRequirements: extractEducation(text),
    responsibilities: extractResponsibilities(text),
    domainIndustry: extractIndustry(text),
    toolsAndTechnologies: extractKnownSkills(text).slice(0, 12),
    summary: `The JD suggests a ${role.toLowerCase()} role in ${extractIndustry(text)} with emphasis on ${requiredSkills.slice(0, 4).join(", ") || "core delivery"}.`
  };
}

function compareSkillSets(resumeText, jobDescription) {
  const resumeSkills = extractKnownSkills(resumeText);
  const jdSkills = extractKnownSkills(jobDescription);
  const matchingSkills = jdSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter((skill) => !resumeSkills.includes(skill));
  const jdKeywords = extractKeywords(jobDescription, 25);
  const resumeKeywordSet = new Set(extractKeywords(resumeText, 30));
  const missingKeywords = jdKeywords.filter((keyword) => !resumeKeywordSet.has(keyword)).slice(0, 8);

  return { resumeSkills, jdSkills, matchingSkills, missingSkills, missingKeywords };
}

function atsFallback({ resumeText, jobDescription }) {
  const { matchingSkills, missingSkills, missingKeywords, resumeSkills, jdSkills } = compareSkillSets(resumeText, jobDescription);
  const overlapScore = jdSkills.length === 0 ? 45 : (matchingSkills.length / Math.max(jdSkills.length, 1)) * 70;
  const keywordScore = missingKeywords.length === 0 ? 20 : Math.max(5, 20 - missingKeywords.length * 2);
  const score = clampScore(overlapScore + keywordScore + Math.min(10, resumeSkills.length));

  return {
    atsMatchScore: score,
    matchingSkills,
    missingSkills,
    missingKeywords,
    resumeStrengths: [
      resumeSkills.length > 0 ? `Resume mentions ${resumeSkills.slice(0, 4).join(", ")}.` : "Resume has domain-relevant experience and project context.",
      resumeText.length > 500 ? "Detailed enough to show sustained experience." : "Concise and readable resume structure."
    ],
    areasForImprovement: [
      missingSkills.length > 0 ? `Add explicit examples for ${missingSkills.slice(0, 3).join(", ")}.` : "Add stronger evidence of impact and measurable outcomes.",
      missingKeywords.length > 0 ? `Mirror keywords like ${missingKeywords.slice(0, 3).join(", ")} where truthful.` : "Include role-specific keywords in bullets and project descriptions."
    ],
    summary: `The resume matches ${matchingSkills.length} of the key skill signals from the JD and can improve by addressing the missing skill and keyword gaps.`
  };
}

function skillGapFallback({ resumeText, jobDescription }) {
  const { matchingSkills, missingSkills, jdSkills, resumeSkills } = compareSkillSets(resumeText, jobDescription);
  const targetSkills = unique([...jdSkills, ...extractKnownSkills(jobDescription), ...extractKeywords(jobDescription, 8)]).slice(0, 10);
  const gaps = missingSkills.length > 0 ? missingSkills : targetSkills.filter((skill) => !resumeSkills.includes(skill)).slice(0, 5);

  return {
    currentSkills: resumeSkills.slice(0, 10),
    requiredSkills: targetSkills,
    skillGaps: gaps.map((skill) => ({
      skill,
      whyItMatters: `${skill} appears in the JD and is likely needed to deliver day-to-day work.`,
      learningResources: fallbackResources[skill] || [`Official ${skill} documentation`, `${skill} tutorial on YouTube`],
      suggestedProjects: [
        `Build a small portfolio project demonstrating ${skill}.`,
        `Add one resume bullet showing practical use of ${skill}.`
      ],
      estimatedLearningTime: fallbackLearningTime(skill)
    }))
  };
}

function fallbackLearningTime(skill) {
  const short = new Set(["Git", "SQL", "React", "Python", "JavaScript", "TypeScript", "REST APIs"]);
  const medium = new Set(["Docker", "Tailwind CSS", "Express.js", "Node.js", "Data Analysis"]);
  if (short.has(skill)) return "1-2 Weeks";
  if (medium.has(skill)) return "2-3 Weeks";
  return "3-4 Weeks";
}

function interviewFallback({ resumeText, jobDescription, role }) {
  const inferredRole = role || roleFromText(jobDescription);
  const keywords = extractKeywords(jobDescription, 12);
  const skills = extractKnownSkills(jobDescription);
  const combined = unique([...skills, ...keywords.map((word) => word.charAt(0).toUpperCase() + word.slice(1))]).slice(0, 10);
  const questionSeeds = [
    `Tell me about a project where you used ${combined[0] || inferredRole} to create measurable impact.`,
    `How would you approach improving a ${inferredRole.toLowerCase()} workflow when requirements change midstream?`,
    `Explain a recent technical decision you made and the tradeoffs involved.`,
    `How do you ensure quality when shipping quickly?`,
    `Describe a time you worked with product, design, or another team to deliver a result.`,
    `What would you prioritize in your first 30 days in this ${inferredRole} role?`,
    `Walk me through a hard problem you solved from start to finish.`,
    `How do you handle ambiguity when the target architecture or scope is not fully defined?`,
    `What is one thing you would improve in the current resume or project story for this role?`,
    `What should a strong candidate know about this role that is not obvious from the JD?`
  ];

  return {
    role: inferredRole,
    questions: questionSeeds.map((question, index) => ({
      question,
      whyAsked: index < 3 ? "Tests role-specific depth and practical experience." : "Tests communication, ownership, and reasoning under pressure.",
      difficulty: index < 3 ? "hard" : index < 7 ? "medium" : "easy"
    }))
  };
}

function evaluateFallback({ question, answer, role, jobDescription, resumeText }) {
  const answerLength = answer.split(/\s+/).length;
  const questionKeywords = extractKeywords(question, 6);
  const answerKeywords = extractKeywords(answer, 18);
  const overlap = questionKeywords.filter((keyword) => answerKeywords.includes(keyword)).length;
  const roleHint = role || roleFromText(jobDescription || resumeText || question);

  return {
    technicalAccuracyScore: clampScore(4 + overlap * 2 + (answerLength > 120 ? 2 : 0)),
    communicationScore: clampScore(answerLength > 80 ? 7 : 5 + Math.min(3, overlap)),
    completenessScore: clampScore(answerLength > 100 ? 8 : 5 + Math.min(3, overlap)),
    confidenceScore: clampScore(answerLength > 60 ? 7 : 5),
    improvementSuggestions: [
      `Tie your answer back to the ${roleHint} expectations more explicitly.`,
      overlap === 0 ? "Use more keywords from the question to show direct alignment." : "Expand the explanation of tradeoffs and the final outcome.",
      answerLength < 100 ? "Add one concrete example or metric." : "Keep the structure crisp: problem, action, result."
    ]
  };
}

export async function analyzeJobDescription(jobDescription) {
  return generateStructuredJson({
    prompt: buildJdPrompt(jobDescription),
    fallback: () => analyzeJobDescriptionFallback(jobDescription),
    temperature: 0.2
  });
}

export async function buildAtsReport({ resumeText, jobDescription }) {
  return generateStructuredJson({
    prompt: buildAtsPrompt({ resumeText, jobDescription }),
    fallback: () => atsFallback({ resumeText, jobDescription }),
    temperature: 0.15
  });
}

export async function buildSkillGapPlan({ resumeText, jobDescription }) {
  return generateStructuredJson({
    prompt: buildSkillGapPrompt({ resumeText, jobDescription }),
    fallback: () => skillGapFallback({ resumeText, jobDescription }),
    temperature: 0.2
  });
}

export async function buildInterviewQuestions({ resumeText, jobDescription, role }) {
  return generateStructuredJson({
    prompt: buildInterviewPrompt({ resumeText, jobDescription, role }),
    fallback: () => interviewFallback({ resumeText, jobDescription, role }),
    temperature: 0.7
  });
}

export async function evaluateInterviewAnswer(payload) {
  return generateStructuredJson({
    prompt: buildEvaluationPrompt(payload),
    fallback: () => evaluateFallback(payload),
    temperature: 0.25
  });
}
