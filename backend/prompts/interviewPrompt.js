import { interviewSchema } from "./sharedSchema.js";

export function buildInterviewPrompt({ resumeText, jobDescription, role }) {
  return `You are a mock interview generator.
Generate exactly 10 interview questions personalized to the resume, job description, and role.
Return ONLY valid JSON matching this schema:
${interviewSchema}

Rules:
- No markdown.
- No extra keys.
- Vary the questions across technical, behavioral, system thinking, and role-fit.
- Make them role specific and dynamic.

Role:
${role || "Unknown"}

Resume:
${resumeText || "No resume provided"}

Job Description:
${jobDescription}`;
}