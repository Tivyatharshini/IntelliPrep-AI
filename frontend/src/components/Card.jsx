export function Card({ title, children, subtitle, accent }) {
  return (
    <article className="card">
      <div className="card-meta">
        <span className="card-title">{title}</span>
        {accent ? <span className="card-accent">{accent}</span> : null}
      </div>
      {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      <div className="card-body">{children}</div>
    </article>
  );
}