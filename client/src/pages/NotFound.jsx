import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page empty">
      <h2>That page doesn't exist</h2>
      <p className="muted">The link may be broken or the page may have moved.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
