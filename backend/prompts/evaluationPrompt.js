import { evaluationSchema } from "./sharedSchema.js";

export function buildEvaluationPrompt({ question, answer, role, jobDescription, resumeText }) {
  return `You are an interview answer evaluator.
Evaluate the answer and return ONLY valid JSON matching this schema:
${evaluationSchema}

Rules:
- No markdown.
- No extra keys.
- Use scores from 0 to 10.
- Make suggestions actionable and specific.
- Consider both content quality and delivery.

Role:
${role || "Unknown"}

Question:
${question}

Answer:
${answer}

Job Description:
${jobDescription || ""}

Resume:
${resumeText || ""}`;
}