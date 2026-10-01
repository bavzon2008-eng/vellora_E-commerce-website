import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container page narrow">
      <h1>About Vellora</h1>
      <p className="lead">Vellora is a demo marketplace built to show how a multi-brand makeup store works from shelf to doorstep.</p>
      <p>The catalog lists well-known cosmetic brands so the shop feels real. Brand and product names belong to their owners and appear only as sample catalog data. Vellora is a fictional store: it is not affiliated with, sponsored by or endorsed by any of those brands, and it is not an authorised retailer of them.</p>
      <p>Orders placed here are not real. The card option is a demo with no payment processing, and nothing will be shipped.</p>
      <Link to="/shop" className="btn btn-primary">Browse the catalog</Link>
    </div>
  );
}
