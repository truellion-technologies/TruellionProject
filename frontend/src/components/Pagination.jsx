import React from 'react';

const Pagination = ({ currentPage, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        ‹ Prev
      </button>
      
      {pages.map(p => (
        <button 
          key={p} 
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      <button 
        className="page-btn" 
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
