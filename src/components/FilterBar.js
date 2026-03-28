import React from 'react';

function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <>
      <div className="controls">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search events, venues..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="date">Sort: Soonest first</option>
          <option value="name">Sort: A–Z</option>
          <option value="category">Sort: Category</option>
        </select>
      </div>

      <div className="cats">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </>
  );
}

export default FilterBar;
