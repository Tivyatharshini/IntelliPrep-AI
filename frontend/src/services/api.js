import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 60000
});

function appendResume(formData, resumeFile, resumeText) {
  if (resumeFile) {
    formData.append("resume", resumeFile);
  } else if (resumeText) {
    formData.append("resumeText", resumeText);
  }
}

export async function analyzeJd(jobDescription) {
  const response = await api.post("/api/analyze-jd", { jobDescription });
  return response.data;
}

export async function atsScore({ jobDescription, resumeFile, resumeText }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  appendResume(formData, resumeFile, resumeText);

  const response = await api.post("/api/ats-score", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function skillGap({ jobDescription, resumeFile, resumeText }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  appendResume(formData, resumeFile, resumeText);

  const response = await api.post("/api/skill-gap", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function generateInterview({ jobDescription, resumeFile, resumeText, role }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  if (role) formData.append("role", role);
  appendResume(formData, resumeFile, resumeText);

  const response = await api.post("/api/generate-interview", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function evaluateAnswer(payload) {
  const response = await api.post("/api/evaluate-answer", payload);
  return response.data;
}
