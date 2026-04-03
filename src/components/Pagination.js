import React from 'react';

function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {start}–{end} of <strong>{total}</strong> events
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ← Prev
        </button>
        <span className="page-indicator">
          Page {page} of {totalPages}
        </span>
        <button
          className="page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;
