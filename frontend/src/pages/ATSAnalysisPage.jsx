import { useState } from "react";
import { atsScore } from "../services/api.js";
import { ErrorState, FileInput, GlassCard, LoadingState, PillList, PrimaryButton, ScoreBar, SectionHeading, TextArea } from "../components/ui.jsx";

const sampleJD = `Backend Engineer role requiring Node.js, Express, REST APIs, SQL, Docker, cloud experience, testing, and clear communication.`;
const sampleResume = `Software engineer with Node.js, Express, REST API, SQL, React, Git, and dashboard project experience. Built APIs, improved reliability, and collaborated with product teams.`;

export default function ATSAnalysisPage() {
  const [jobDescription, setJobDescription] = useState(sampleJD);
  const [resumeText, setResumeText] = useState(sampleResume);
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await atsScore({ jobDescription, resumeFile, resumeText });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to calculate ATS score.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="ATS Analysis"
        subtitle="Upload a resume PDF/DOCX/TXT or paste resume text, then compare it against the job description to generate a score and improvement plan."
      />

      <form onSubmit={handleAnalyze} className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <TextArea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={9} placeholder="Paste job description here..." />
          <FileInput label={resumeFile ? resumeFile.name : "Upload resume"} onChange={(event) => setResumeFile(event.target.files?.[0] || null)} />
          <TextArea value={resumeText} onChange={(event) => setResumeText(event.target.value)} rows={8} placeholder="Or paste resume text here..." />
          <PrimaryButton type="submit" disabled={loading}>{loading ? "Scoring..." : "Generate ATS score"}</PrimaryButton>
        </div>

        <div className="space-y-4">
          {error ? <ErrorState message={error} /> : null}
          {loading ? <LoadingState label="Analyzing resume and job description..." /> : null}

          {result ? (
            <GlassCard title={`ATS Match Score: ${result.atsMatchScore}%`} subtitle={result.summary}>
              <ScoreBar label="Match strength" score={result.atsMatchScore} />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <PillList title="Matching Skills" items={result.matchingSkills} />
                <PillList title="Missing Skills" items={result.missingSkills} />
                <PillList title="Missing Keywords" items={result.missingKeywords} />
                <PillList title="Resume Strengths" items={result.resumeStrengths} />
                <div className="md:col-span-2">
                  <PillList title="Areas for Improvement" items={result.areasForImprovement} />
                </div>
              </div>
            </GlassCard>
          ) : null}
        </div>
      </form>
    </div>
  );
}
