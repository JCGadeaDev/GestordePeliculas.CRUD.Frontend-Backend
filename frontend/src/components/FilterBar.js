import React from 'react';
import './FilterBar.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'watched', label: '✓ Vistas' },
  { value: 'pending', label: '⏳ Pendientes' },
  { value: 'favorite', label: '♥ Favoritas' },
];

const SORT_OPTIONS = [
  { value: 'added_at', label: 'Reciente' },
  { value: 'title', label: 'Título A-Z' },
  { value: 'year_desc', label: 'Año (nuevo)' },
  { value: 'year_asc', label: 'Año (antiguo)' },
  { value: 'vote_average', label: 'Rating TMDB' },
  { value: 'personal_rating', label: 'Mi rating' },
];

const FilterBar = ({ search, onSearchChange, status, onStatusChange, genre, onGenreChange, sortBy, onSortChange, genres, totalVisible, total }) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <div className="filter-search">
          <span className="filter-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar en tu colección..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-input"
          />
          {search && (
            <button className="filter-clear" onClick={() => onSearchChange('')}>✕</button>
          )}
        </div>

        <div className="filter-status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-chip ${status === opt.value ? 'filter-chip--active' : ''}`}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {genres.length > 0 && (
          <div className="filter-genres">
            <button
              className={`filter-chip filter-chip--genre ${genre === 'all' ? 'filter-chip--active' : ''}`}
              onClick={() => onGenreChange('all')}
            >
              Géneros
            </button>
            {genres.map((g) => (
              <button
                key={g}
                className={`filter-chip filter-chip--genre ${genre === g ? 'filter-chip--active' : ''}`}
                onClick={() => onGenreChange(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        <div className="filter-sort">
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="filter-select">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {(search || status !== 'all' || genre !== 'all') && (
        <div className="filter-results">
          Mostrando <strong>{totalVisible}</strong> de <strong>{total}</strong> películas
        </div>
      )}
    </div>
  );
};

export default FilterBar;
