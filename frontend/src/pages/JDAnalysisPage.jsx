import { useState } from "react";
import { analyzeJd } from "../services/api.js";
import { ErrorState, GlassCard, LoadingState, PillList, PrimaryButton, SecondaryButton, SectionHeading, TextArea } from "../components/ui.jsx";

const sampleJD = `Data Scientist

We are looking for a Data Scientist to work on FinTech risk modeling. The role requires Python, SQL, machine learning, statistics, and strong communication. Preferred experience with AWS, Docker, and experimentation. Responsibilities include data analysis, model building, reporting, stakeholder communication, and collaboration with product teams. A Bachelor's degree in Computer Science, Statistics, or a related field is preferred.`;

export default function JDAnalysisPage() {
  const [jobDescription, setJobDescription] = useState(sampleJD);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await analyzeJd(jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to analyze job description.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="JD Analysis"
        subtitle="Paste a job description and Gemini will extract the role, skills, experience, education, responsibilities, industry, and tools as structured JSON."
      />

      <form onSubmit={handleAnalyze} className="space-y-4">
        <TextArea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={10} placeholder="Paste job description here..." />
        <div className="flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={loading}>{loading ? "Analyzing..." : "Analyze JD"}</PrimaryButton>
          <SecondaryButton onClick={() => setJobDescription(sampleJD)}>Load sample</SecondaryButton>
        </div>
      </form>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <LoadingState label="Gemini is parsing the job description..." /> : null}

      {result ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <GlassCard title={result.role || "Role"} subtitle={result.summary || "Extracted job description details."}>
            <div className="grid gap-4 md:grid-cols-2">
              <PillList title="Required Skills" items={result.requiredSkills} />
              <PillList title="Preferred Skills" items={result.preferredSkills} />
              <PillList title="Responsibilities" items={result.responsibilities} />
              <PillList title="Tools & Technologies" items={result.toolsAndTechnologies} />
              <PillList title="Education" items={result.educationRequirements} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <StatChip label="Experience" value={result.experienceRequired} />
              <StatChip label="Industry" value={result.domainIndustry} />
              <StatChip label="Primary Focus" value={result.responsibilities?.[0] || "Role-specific delivery"} />
            </div>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">{value || "Not found"}</p>
    </div>
  );
}
