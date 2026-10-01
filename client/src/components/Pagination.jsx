export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  // Show first, last, and a window around the current page
  const nums = [];
  for (let p = 1; p <= pages; p += 1) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`gap${i}`} className="muted">…</span>
        ) : (
          <button key={n} type="button" className={`page-btn ${n === page ? 'active' : ''}`} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>
        )
      )}
      <button type="button" className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
