export function FileUploader({ label, accept, onChange, helperText }) {
  return (
    <label className="file-uploader">
      <span>{label}</span>
      <input type="file" accept={accept} onChange={onChange} />
      {helperText ? <small>{helperText}</small> : null}
    </label>
  );
}