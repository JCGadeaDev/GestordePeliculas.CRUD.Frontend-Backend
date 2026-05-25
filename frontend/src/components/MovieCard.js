import React from 'react';
import { posterUrl } from '../services/tmdbService';
import './MovieCard.css';

const STATUS_CONFIG = {
  watched:  { icon: '✓', label: 'Vista',      className: 'status--watched' },
  favorite: { icon: '♥', label: 'Favorita',   className: 'status--favorite' },
  pending:  { icon: '⏳', label: 'Pendiente',  className: 'status--pending' },
};

const StarRating = ({ value }) => {
  if (!value) return null;
  return (
    <span className="card-stars">
      {'★'.repeat(value)}{'☆'.repeat(5 - value)}
    </span>
  );
};

const MovieCard = ({ movie, onEdit, onDelete, onClick }) => {
  const status = STATUS_CONFIG[movie.status] || STATUS_CONFIG.pending;
  const poster = posterUrl(movie.poster_path);
  const year = movie.year || (movie.release_date ? movie.release_date.slice(0, 4) : '');
  const genres = movie.genres || [];

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${movie.title}"?`)) onDelete(movie._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(movie);
  };

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="card-poster-placeholder">
            <span>🎬</span>
            <p>{movie.title}</p>
          </div>
        )}

        <span className={`card-status ${status.className}`}>
          {status.icon} {status.label}
        </span>

        {movie.vote_average > 0 && (
          <span className="card-tmdb-rating">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        )}

        <div className="card-overlay">
          <div className="card-overlay-content">
            <h3 className="overlay-title">{movie.title}</h3>
            <p className="overlay-meta">
              {year}{movie.runtime ? ` · ${movie.runtime}m` : ''}
              {movie.director ? ` · ${movie.director}` : ''}
            </p>
            {genres.length > 0 && (
              <div className="overlay-genres">
                {genres.slice(0, 3).map((g) => (
                  <span key={typeof g === 'object' ? g.id : g} className="overlay-genre">
                    {typeof g === 'object' ? g.name : g}
                  </span>
                ))}
              </div>
            )}
            {movie.overview && (
              <p className="overlay-overview">{movie.overview.slice(0, 120)}…</p>
            )}
            {movie.personal_rating > 0 && (
              <div className="overlay-personal">
                <StarRating value={movie.personal_rating} />
              </div>
            )}
          </div>

          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button className="card-btn card-btn--edit" onClick={handleEdit} title="Editar">
              ✏️ Editar
            </button>
            <button className="card-btn card-btn--delete" onClick={handleDelete} title="Eliminar">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-meta">
          <span className="card-year">{year}</span>
          {genres.length > 0 && (
            <span className="card-genre">
              {typeof genres[0] === 'object' ? genres[0].name : genres[0]}
            </span>
          )}
        </div>
        {movie.personal_rating > 0 && <StarRating value={movie.personal_rating} />}
      </div>
    </div>
  );
};

export default MovieCard;
