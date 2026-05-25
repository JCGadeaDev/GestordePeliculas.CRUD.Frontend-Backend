import React from 'react';
import MovieCard from './MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ movies, onEdit, onDelete, onClick, loading }) => {
  if (loading) {
    return (
      <div className="grid-skeletons">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-poster" />
            <div className="skeleton-info">
              <div className="skeleton-line skeleton-line--title" />
              <div className="skeleton-line skeleton-line--meta" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="grid-empty">
        <span className="grid-empty-icon">🎬</span>
        <h3>No hay películas aquí</h3>
        <p>Probá cambiar los filtros o agregá una película nueva.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
