import express from "express";
import { analyzeJdController, atsScoreController, evaluateAnswerController, generateInterviewController, skillGapController } from "../controllers/analysisController.js";
import { uploadResume } from "../middleware/upload.js";

const router = express.Router();

router.post("/analyze-jd", analyzeJdController);
router.post("/ats-score", uploadResume.single("resume"), atsScoreController);
router.post("/skill-gap", uploadResume.single("resume"), skillGapController);
router.post("/generate-interview", uploadResume.single("resume"), generateInterviewController);
router.post("/evaluate-answer", evaluateAnswerController);

export { router as analysisRoutes };