import { useState } from "react";
import { skillGap } from "../services/api.js";
import { ErrorState, FileInput, GlassCard, LoadingState, PillList, PrimaryButton, SectionHeading, TextArea } from "../components/ui.jsx";

const sampleJD = `Frontend Engineer role focused on React, TypeScript, Tailwind CSS, testing, accessibility, API integration, and performance optimization.`;
const sampleResume = `Frontend developer with React, JavaScript, CSS, REST APIs, Git, and responsive dashboard experience.`;

export default function SkillGapPage() {
  const [jobDescription, setJobDescription] = useState(sampleJD);
  const [resumeText, setResumeText] = useState(sampleResume);
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await skillGap({ jobDescription, resumeFile, resumeText });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to build skill gap roadmap.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Skill Gap Dashboard"
        subtitle="Compare your current skills with the job requirements and get a practical roadmap for every missing skill."
      />

      <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <TextArea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={9} placeholder="Paste job description here..." />
          <FileInput label={resumeFile ? resumeFile.name : "Upload resume"} onChange={(event) => setResumeFile(event.target.files?.[0] || null)} />
          <TextArea value={resumeText} onChange={(event) => setResumeText(event.target.value)} rows={8} placeholder="Or paste resume text here..." />
          <PrimaryButton type="submit" disabled={loading}>{loading ? "Building roadmap..." : "Generate skill gap roadmap"}</PrimaryButton>
        </div>

        <div className="space-y-4">
          {error ? <ErrorState message={error} /> : null}
          {loading ? <LoadingState label="Comparing current and required skills..." /> : null}

          {result ? (
            <GlassCard title="Skill Roadmap" subtitle="Focus on the missing skills first, then add project proof to your resume.">
              <Roadmap currentSkills={result.currentSkills} requiredSkills={result.requiredSkills} skillGaps={result.skillGaps} />
            </GlassCard>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function Roadmap({ currentSkills, requiredSkills, skillGaps }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <PillList title="Current Skills" items={currentSkills} />
        <PillList title="Required Skills" items={requiredSkills} />
      </div>

      <div className="space-y-4">
        {(skillGaps || []).map((gap) => (
          <div key={gap.skill} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-slate-950 dark:text-white">{gap.skill}</h4>
              <span className="rounded-full bg-brand-600/15 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-100">{gap.estimatedLearningTime}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{gap.whyItMatters}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <PillList title="Resources" items={gap.learningResources} />
              <PillList title="Suggested Projects" items={gap.suggestedProjects} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
