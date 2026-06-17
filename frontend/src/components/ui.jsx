import clsx from "clsx";

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-100/80">AI Interview Copilot</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
    </div>
  );
}

export function GlassCard({ title, subtitle, children, className }) {
  return (
    <section className={clsx("rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5", className)}>
      {title ? <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{label}</div>;
}

export function ErrorState({ message }) {
  return <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-100">{message}</div>;
}

export function TextArea({ value, onChange, rows = 8, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-brand-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500"
      placeholder={placeholder}
    />
  );
}

export function PrimaryButton({ children, type = "button", disabled = false, onClick }) {
  return (
    <button
      className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

export function FileInput({ label, onChange }) {
  return (
    <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
      <span className="mb-2 block font-semibold text-slate-950 dark:text-white">{label}</span>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={onChange}
        className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-500"
      />
    </label>
  );
}

export function PillList({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {(items || []).length === 0 ? <li className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5">Not found</li> : null}
        {(items || []).map((item) => (
          <li key={item} className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-white/5">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ScoreBar({ label = "Score", score }) {
  const safeScore = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Number(score))) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{safeScore}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200 dark:bg-white/10">
        <div className="h-3 rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${safeScore}%` }} />
      </div>
    </div>
  );
}
