import { jdAnalysisSchema } from "./sharedSchema.js";

export function buildJdPrompt(jobDescription) {
  return `You are an ATS and hiring analysis engine.
Return ONLY valid JSON that matches this schema exactly:
${jdAnalysisSchema}

Rules:
- No markdown.
- No extra keys.
- Use concise recruiter-style language.
- Infer the role dynamically from the text.
- Extract only signals supported by the job description.
- If a field is unknown, return an empty array or a short neutral string.

Job Description:
${jobDescription}`;
}