import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable Filter Bar with:
 * - Search text input
 * - Date From input
 * - Date To input
 * - Clear button
 *
 * Props:
 *   search, setSearch
 *   dateFrom, setDateFrom
 *   dateTo, setDateTo
 *   showDateFilter (bool) - show/hide date pickers, default true
 */
export default function FilterBar({ search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo, showDateFilter = true }) {
  const handleClear = () => {
    setSearch('');
    if (setDateFrom) setDateFrom('');
    if (setDateTo) setDateTo('');
  };

  const hasFilter = search || dateFrom || dateTo;

  return (
    <div className="filter-bar">
      <div className="filter-bar-search">
        <Search size={15} className="filter-search-icon" />
        <input
          type="text"
          className="filter-input"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {showDateFilter && (
        <>
          <div className="filter-date-group">
            <label>From</label>
            <input
              type="date"
              className="filter-input"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>
          <div className="filter-date-group">
            <label>To</label>
            <input
              type="date"
              className="filter-input"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
        </>
      )}
      {hasFilter && (
        <button className="filter-clear-btn" onClick={handleClear} title="Clear Filters">
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
