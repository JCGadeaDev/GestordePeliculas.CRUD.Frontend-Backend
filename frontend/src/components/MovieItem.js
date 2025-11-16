import React from 'react';
import './MovieItem.css';

const MovieItem = ({ movie, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${movie.title}"?`)) {
      onDelete(movie._id);
    }
  };

  return (
    <div className="movie-item">
      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
      </div>
      
      <div className="movie-actions">
        <button 
          onClick={() => onEdit(movie)} 
          className="btn btn-edit"
          title="Editar película"
        >
          ✏️
        </button>
        <button 
          onClick={handleDelete} 
          className="btn btn-delete"
          title="Eliminar película"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default MovieItem;