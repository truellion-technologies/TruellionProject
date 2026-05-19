import React from 'react';

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="search-section">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className={`clear-search ${search.length > 0 ? 'visible' : ''}`}
          onClick={() => setSearch('')}
        >
          <i className="fas fa-times-circle"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
