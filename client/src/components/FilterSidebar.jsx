import { CATEGORY_GROUPS } from '../utils/format.js';

const RATINGS = [4.5, 4, 3];

export default function FilterSidebar({ meta, filters, onChange, onClear }) {
  const selectedBrands = filters.brand ? filters.brand.split(',') : [];

  const toggleBrand = (b) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    onChange({ brand: next.join(',') });
  };

  return (
    <div className="filters">
      <div className="filter-block">
        <h4>Category</h4>
        <label className="radio"><input type="radio" name="cat" checked={!filters.category} onChange={() => onChange({ category: '' })} /> All</label>
        {Object.entries(CATEGORY_GROUPS).map(([group, subs]) => (
          <div key={group}>
            <label className="radio strong"><input type="radio" name="cat" checked={filters.category === group} onChange={() => onChange({ category: group })} /> {group}</label>
            {(filters.category === group || subs.includes(filters.category)) &&
              subs.map((s) => (
                <label key={s} className="radio sub"><input type="radio" name="cat" checked={filters.category === s} onChange={() => onChange({ category: s })} /> {s}</label>
              ))}
          </div>
        ))}
      </div>

      <div className="filter-block">
        <h4>Brand</h4>
        <div className="scroll-list">
          {(meta?.brands || []).map((b) => (
            <label key={b} className="check"><input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} /> {b}</label>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h4>Price (₹)</h4>
        <div className="price-inputs">
          <input type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} aria-label="Minimum price" />
          <span>–</span>
          <input type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} aria-label="Maximum price" />
        </div>
      </div>

      <div className="filter-block">
        <h4>Rating</h4>
        <label className="radio"><input type="radio" name="rating" checked={!filters.rating} onChange={() => onChange({ rating: '' })} /> Any</label>
        {RATINGS.map((r) => (
          <label key={r} className="radio"><input type="radio" name="rating" checked={String(filters.rating) === String(r)} onChange={() => onChange({ rating: String(r) })} /> {r}★ & up</label>
        ))}
      </div>

      <button type="button" className="btn btn-ghost btn-block" onClick={onClear}>Clear all filters</button>
    </div>
  );
}
