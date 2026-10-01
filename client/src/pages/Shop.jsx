import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import ProductGrid from '../components/ProductGrid.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useDebounce from '../hooks/useDebounce.js';

const LIMIT = 12;
const KEYS = ['search', 'category', 'brand', 'minPrice', 'maxPrice', 'rating', 'sort', 'page'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0, pages: 1, page: 1 });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = Object.fromEntries(KEYS.map((k) => [k, params.get(k) || '']));
  const page = Number(filters.page) || 1;

  const [searchText, setSearchText] = useState(filters.search);
  const debouncedSearch = useDebounce(searchText);

  // keep the box in sync when the navbar search changes the URL
  useEffect(() => setSearchText(filters.search), [filters.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => (v === '' || v === undefined ? next.delete(k) : next.set(k, v)));
      if (!('page' in patch)) next.delete('page');
      setParams(next, { replace: false });
    },
    [params, setParams]
  );

  useEffect(() => {
    if (debouncedSearch !== filters.search) update({ search: debouncedSearch.trim() });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api.get('/products/meta/filters').then((r) => setMeta(r.data)).catch(() => {});
  }, []);

  const query = params.toString();
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get('/products', { params: { ...filters, sort: filters.sort || 'newest', page, limit: LIMIT } })
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAll = () => {
    setSearchText('');
    setParams({});
  };

  const changePage = (p) => {
    update({ page: String(p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{filters.category || 'All products'}</h1>
        <p className="muted">{loading ? 'Loading…' : `${data.total} product${data.total === 1 ? '' : 's'}`}</p>
      </div>

      <div className="shop-toolbar">
        <input className="input" type="search" placeholder="Search by name, brand or category" value={searchText} onChange={(e) => setSearchText(e.target.value)} aria-label="Search products" />
        <select className="input" value={filters.sort || 'newest'} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort products">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name-asc">Name A–Z</option>
        </select>
        <button type="button" className="btn btn-ghost filter-toggle" onClick={() => setShowFilters(true)}>Filters</button>
      </div>

      <div className="shop-layout">
        <aside className={`sidebar ${showFilters ? 'open' : ''}`}>
          <div className="sidebar-head">
            <strong>Filters</strong>
            <button type="button" className="icon-btn" onClick={() => setShowFilters(false)} aria-label="Close filters">×</button>
          </div>
          <FilterSidebar meta={meta} filters={filters} onChange={update} onClear={clearAll} />
          <button type="button" className="btn btn-primary btn-block sidebar-apply" onClick={() => setShowFilters(false)}>Show {data.total} results</button>
        </aside>

        <div>
          {error && <div className="notice notice-error">{error}</div>}
          {loading && <LoadingSpinner label="Finding products…" />}
          {!loading && !error && data.products.length === 0 && (
            <div className="empty">
              <h3>No products match those filters</h3>
              <p className="muted">Try a different search term or remove a filter.</p>
              <button type="button" className="btn btn-primary" onClick={clearAll}>Clear filters</button>
            </div>
          )}
          {!loading && data.products.length > 0 && <ProductGrid products={data.products} />}
          <Pagination page={data.page || page} pages={data.pages} onChange={changePage} />
        </div>
      </div>
    </div>
  );
}
