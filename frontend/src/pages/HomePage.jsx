import { Link } from "react-router-dom";

const steps = [
  "Paste a job description and optionally upload a resume.",
  "Let Gemini extract role signals, ATS gaps, and interview questions.",
  "Review the dashboard, then run the mock interview and save history locally."
];

function HomePage() {
  return (
    <div className="hero-grid">
      <section className="hero-copy panel">
        <p className="panel-kicker">Resume + JD intelligence</p>
        <h2>Prepare faster with a dynamic copilot that adapts to any role.</h2>
        <p className="lead">
          AI Interview Copilot analyzes a resume and job description with Gemini, then turns the results into a practical interview prep dashboard.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/jd-analysis">Start with JD analysis</Link>
          <Link className="secondary-btn" to="/mock-interview">Try mock interview</Link>
        </div>
      </section>

      <section className="panel">
        <p className="panel-kicker">How it works</p>
        <div className="step-list">
          {steps.map((step, index) => (
            <div key={step} className="step-item">
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;