import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractDocumentTextFromUpload } from "../services/documentService.js";
import {
  analyzeJobDescription,
  buildAtsReport,
  buildInterviewQuestions,
  buildSkillGapPlan,
  evaluateInterviewAnswer
} from "../services/analysisService.js";

const jdSchema = z.object({
  jobDescription: z.string().trim().min(20, "Job description is required")
});

const atsSchema = z.object({
  jobDescription: z.string().trim().min(20, "Job description is required"),
  resumeText: z.string().trim().optional()
});

const mockSchema = z.object({
  jobDescription: z.string().trim().min(20, "Job description is required"),
  role: z.string().trim().optional(),
  resumeText: z.string().trim().optional()
});

const evaluateSchema = z.object({
  question: z.string().trim().min(5, "Question is required"),
  answer: z.string().trim().min(5, "Answer is required"),
  role: z.string().trim().optional(),
  jobDescription: z.string().trim().optional(),
  resumeText: z.string().trim().optional()
});

function parseBody(schema, payload) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }

  return result.data;
}

async function readResumeText(req) {
  if (req.file) {
    return extractDocumentTextFromUpload(req.file);
  }

  const resumeText = String(req.body?.resumeText || "").trim();
  return resumeText;
}

export const analyzeJdController = asyncHandler(async (req, res) => {
  const { jobDescription } = parseBody(jdSchema, req.body);
  const result = await analyzeJobDescription(jobDescription);
  res.json(result);
});

export const atsScoreController = asyncHandler(async (req, res) => {
  const resumeText = await readResumeText(req);
  const { jobDescription } = parseBody(atsSchema, { ...req.body, resumeText });

  if (!resumeText) {
    const error = new Error("Resume file or resumeText is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await buildAtsReport({ resumeText, jobDescription });
  res.json(result);
});

export const skillGapController = asyncHandler(async (req, res) => {
  const resumeText = await readResumeText(req);
  const { jobDescription } = parseBody(atsSchema, { ...req.body, resumeText });

  if (!resumeText) {
    const error = new Error("Resume file or resumeText is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await buildSkillGapPlan({ resumeText, jobDescription });
  res.json(result);
});

export const generateInterviewController = asyncHandler(async (req, res) => {
  const resumeText = await readResumeText(req);
  const { jobDescription, role } = parseBody(mockSchema, { ...req.body, resumeText });

  const result = await buildInterviewQuestions({ resumeText, jobDescription, role });
  res.json(result);
});

export const evaluateAnswerController = asyncHandler(async (req, res) => {
  const payload = parseBody(evaluateSchema, req.body);
  const result = await evaluateInterviewAnswer(payload);
  res.json(result);
});