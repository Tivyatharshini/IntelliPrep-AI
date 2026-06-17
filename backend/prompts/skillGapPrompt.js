import { skillGapSchema } from "./sharedSchema.js";

export function buildSkillGapPrompt({ resumeText, jobDescription }) {
  return `You are a career skill gap analyst.
Compare the resume and job description and return ONLY valid JSON matching this schema:
${skillGapSchema}

Rules:
- No markdown.
- No extra keys.
- Keep the roadmap practical for a job seeker.
- Suggested resources should be well-known and generalizable.

Resume:
${resumeText}

Job Description:
${jobDescription}`;
}