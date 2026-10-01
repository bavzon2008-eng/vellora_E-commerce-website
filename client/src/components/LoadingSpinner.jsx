export default function LoadingSpinner({ label = 'Loading…', fullPage = false }) {
  return (
    <div className={`spinner-wrap ${fullPage ? 'full' : ''}`} role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
