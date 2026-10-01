export default function Stars({ rating = 0, count }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="stars" title={`${rating} out of 5`}>
      <span className="stars-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
      <span className="stars-num">{Number(rating).toFixed(1)}</span>
      {count !== undefined && <span className="muted">({count.toLocaleString('en-IN')})</span>}
    </span>
  );
}
