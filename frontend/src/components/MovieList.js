import React from 'react';
import MovieItem from './MovieItem';
import './MovieList.css';

const MovieList = ({ movies, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando películas...</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hay películas disponibles</h3>
        <p>Agrega tu primera película usando el formulario de arriba.</p>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <h2>Lista de Películas ({movies.length})</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieItem
            key={movie._id}
            movie={movie}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;