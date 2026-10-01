import { useEffect, useState } from 'react';

// Inline SVG fallback so it can never fail to load
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#F1D9D3"/><g fill="none" stroke="#5A2B3A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".55"><rect x="168" y="190" width="64" height="110" rx="8"/><path d="M178 190v-40q0-24 22-24t22 24v40"/></g></svg>`
  );

export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  return (
    <img
      className={`product-img ${className}`}
      src={failed ? FALLBACK : src}
      alt={alt || 'Product'}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
