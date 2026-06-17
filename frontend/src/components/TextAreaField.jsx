export function TextAreaField({ label, value, onChange, placeholder, rows = 8 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
    </label>
  );
}