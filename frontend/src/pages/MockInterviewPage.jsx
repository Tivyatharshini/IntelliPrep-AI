import { useMemo, useState } from "react";
import { evaluateAnswer, generateInterview } from "../services/api.js";
import { ErrorState, FileInput, GlassCard, LoadingState, PrimaryButton, ScoreBar, SecondaryButton, SectionHeading, TextArea } from "../components/ui.jsx";

const demoJD = `Frontend Engineer. Build polished React experiences, collaborate with product and design, improve performance, support accessibility, integrate APIs, and ship measurable improvements quickly.`;

export default function MockInterviewPage() {
  const [jobDescription, setJobDescription] = useState(demoJD);
  const [resumeText, setResumeText] = useState("React developer with JavaScript, REST API, accessibility, dashboard, and performance optimization experience.");
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState("Frontend Engineer");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ai-interview-sessions") || "[]");
    } catch {
      return [];
    }
  });
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];
  const progress = useMemo(() => (questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0), [currentIndex, questions.length]);

  async function handleGenerateQuestions(event) {
    event.preventDefault();
    setLoadingQuestions(true);
    setError("");
    setEvaluation(null);

    try {
      const data = await generateInterview({ jobDescription, resumeText, resumeFile, role });
      setQuestions(data.questions || []);
      setRole(data.role || role);
      setCurrentIndex(0);
      setAnswer("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to generate interview questions.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function handleEvaluate(event) {
    event.preventDefault();
    if (!currentQuestion || !answer.trim()) return;

    setLoadingEval(true);
    setError("");

    try {
      const data = await evaluateAnswer({
        question: currentQuestion.question,
        answer,
        role,
        jobDescription,
        resumeText
      });

      const entry = {
        id: crypto.randomUUID(),
        role,
        question: currentQuestion.question,
        answer,
        evaluation: data,
        createdAt: new Date().toISOString()
      };

      const updatedHistory = [entry, ...sessionHistory].slice(0, 10);
      setSessionHistory(updatedHistory);
      localStorage.setItem("ai-interview-sessions", JSON.stringify(updatedHistory));
      setEvaluation(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to evaluate answer.");
    } finally {
      setLoadingEval(false);
    }
  }

  function goNext() {
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
    setAnswer("");
    setEvaluation(null);
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Mock Interview Mode"
        subtitle="Generate 10 role-specific questions, answer them one by one, and score technical accuracy, communication, completeness, and confidence."
      />

      <form onSubmit={handleGenerateQuestions} className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
            placeholder="Role"
          />
          <TextArea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={8} placeholder="Job description" />
          <FileInput label={resumeFile ? resumeFile.name : "Upload resume"} onChange={(event) => setResumeFile(event.target.files?.[0] || null)} />
          <TextArea value={resumeText} onChange={(event) => setResumeText(event.target.value)} rows={7} placeholder="Resume text (optional but recommended)" />
          <PrimaryButton type="submit" disabled={loadingQuestions}>{loadingQuestions ? "Generating questions..." : "Generate interview set"}</PrimaryButton>
        </div>

        <div className="space-y-4">
          {error ? <ErrorState message={error} /> : null}
          {loadingQuestions ? <LoadingState label="Building your personalized interview set..." /> : null}

          {questions.length > 0 ? (
            <GlassCard title={`Question ${currentIndex + 1} of ${questions.length}`} subtitle={currentQuestion?.whyAsked}>
              <ScoreBar label="Interview progress" score={progress} />
              <QuestionCard question={currentQuestion} />
              <form onSubmit={handleEvaluate} className="mt-4 space-y-3">
                <TextArea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={7} placeholder="Type your answer here..." />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton type="submit" disabled={loadingEval || !answer.trim()}>{loadingEval ? "Evaluating..." : "Evaluate answer"}</PrimaryButton>
                  <SecondaryButton onClick={goNext}>Next question</SecondaryButton>
                </div>
              </form>
            </GlassCard>
          ) : null}

          {evaluation ? <EvaluationCard evaluation={evaluation} /> : null}
        </div>
      </form>

      <HistoryPanel history={sessionHistory} />
    </div>
  );
}

function QuestionCard({ question }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Question</p>
      <p className="mt-2 text-base leading-7 text-slate-950 dark:text-white">{question?.question}</p>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Difficulty: {question?.difficulty}</p>
    </div>
  );
}

function EvaluationCard({ evaluation }) {
  return (
    <GlassCard title="Answer Evaluation" subtitle="Gemini scores your response and suggests what to improve next.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Technical" score={evaluation.technicalAccuracyScore} />
        <Metric label="Communication" score={evaluation.communicationScore} />
        <Metric label="Completeness" score={evaluation.completenessScore} />
        <Metric label="Confidence" score={evaluation.confidenceScore} />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Improvement Suggestions</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {(evaluation.improvementSuggestions || []).map((item) => (
            <li key={item} className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5">{item}</li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}

function Metric({ label, score }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{score}/10</p>
    </div>
  );
}

function HistoryPanel({ history }) {
  return (
    <GlassCard title="Previous interview sessions" subtitle="Stored locally in your browser.">
      <div className="space-y-3">
        {(history || []).length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No sessions saved yet.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.question}</p>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
