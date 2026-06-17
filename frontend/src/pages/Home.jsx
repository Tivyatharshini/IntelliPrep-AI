import { Link } from "react-router-dom";
import { ArrowRight, FileText, MessageSquareText, Radar, Sparkles } from "lucide-react";
import { GlassCard, SectionHeading } from "../components/ui.jsx";

const featureCards = [
  {
    title: "JD Analysis",
    description: "Extract role, skills, experience, industry, responsibilities, and tools from a pasted job description.",
    icon: FileText,
    to: "/jd-analysis"
  },
  {
    title: "ATS Score",
    description: "Compare resume and JD to identify matching skills, missing keywords, and resume improvements.",
    icon: Radar,
    to: "/ats-analysis"
  },
  {
    title: "Skill Gap Roadmap",
    description: "Turn missing skills into learning resources, project ideas, and realistic time estimates.",
    icon: Sparkles,
    to: "/skill-gap"
  },
  {
    title: "Mock Interview",
    description: "Generate personalized questions and evaluate answers across technical depth and communication.",
    icon: MessageSquareText,
    to: "/mock-interview"
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="AI Interview Copilot"
        subtitle="Prepare for a role by analyzing the job description, comparing your resume, mapping skill gaps, and practicing with a Gemini-powered mock interview."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard title="What this app does" subtitle="Structured interview prep from real resume and job data.">
          <ul className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
            <li>- Parses job descriptions into clean structured fields.</li>
            <li>- Scores resume alignment with ATS-style matching signals.</li>
            <li>- Builds a learning roadmap for missing skills.</li>
            <li>- Generates and evaluates personalized mock interview answers.</li>
          </ul>
        </GlassCard>

        <GlassCard title="Sample workflow" subtitle="Use the modules from left to right.">
          <ol className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
            <li>1. Paste a JD and review extracted requirements.</li>
            <li>2. Upload or paste your resume for ATS analysis.</li>
            <li>3. Use the skill gap page to plan improvements.</li>
            <li>4. Practice in mock interview mode and save feedback locally.</li>
          </ol>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.title} to={card.to} className="group block">
              <GlassCard className="h-full transition duration-200 group-hover:-translate-y-1 group-hover:border-brand-500/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/15 text-brand-600 dark:text-brand-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-100">
                  Open module
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
