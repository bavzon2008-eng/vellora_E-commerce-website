export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="status">
          <span>{t.message}</span>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
}
