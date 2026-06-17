import { atsSchema } from "./sharedSchema.js";

export function buildAtsPrompt({ resumeText, jobDescription }) {
  return `You are an ATS scoring engine.
Compare the resume and job description and return ONLY valid JSON matching this schema:
${atsSchema}

Rules:
- No markdown.
- No extra keys.
- Score from 0 to 100.
- Be specific and practical.
- Prefer exact evidence from the texts.

Resume:
${resumeText}

Job Description:
${jobDescription}`;
}