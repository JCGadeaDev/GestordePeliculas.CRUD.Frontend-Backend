import React, { useState } from 'react';
import { posterUrl, backdropUrl } from '../services/tmdbService';
import './MovieDetailModal.css';

const STATUS_CONFIG = {
  watched:  { icon: '✓', label: 'Vista',     color: 'green' },
  favorite: { icon: '♥', label: 'Favorita',  color: 'red' },
  pending:  { icon: '⏳', label: 'Pendiente', color: 'gold' },
};

const StarRow = ({ value }) => (
  <span className="detail-stars">
    {[1,2,3,4,5].map((n) => (
      <span key={n} style={{ color: n <= value ? 'var(--gold)' : 'var(--text-muted)' }}>★</span>
    ))}
  </span>
);

const MovieDetailModal = ({ movie, onEdit, onDelete, onClose }) => {
  const [imgError, setImgError] = useState(false);
  const status = STATUS_CONFIG[movie.status] || STATUS_CONFIG.pending;
  const year = movie.year || movie.release_date?.slice(0, 4) || '';
  const genres = (movie.genres || []).map((g) => (typeof g === 'object' ? g.name : g));
  const cast = movie.cast || [];

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar "${movie.title}" de tu colección?`)) {
      onDelete(movie._id);
      onClose();
    }
  };

  const backdrop = !imgError && backdropUrl(movie.backdrop_path);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>

        <div className="detail-backdrop" style={backdrop ? { backgroundImage: `url(${backdrop})` } : {}}>
          <div className="detail-backdrop-gradient" />
          <button className="modal-close detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-content">
          <div className="detail-poster-col">
            {movie.poster_path ? (
              <img
                src={posterUrl(movie.poster_path)}
                alt={movie.title}
                className="detail-poster-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="detail-poster-placeholder">🎬</div>
            )}
          </div>

          <div className="detail-info-col">
            <div className={`detail-status detail-status--${status.color}`}>
              {status.icon} {status.label}
            </div>

            <h2 className="detail-title">{movie.title}</h2>

            <div className="detail-meta-row">
              {year && <span className="detail-chip">{year}</span>}
              {movie.runtime && <span className="detail-chip">{movie.runtime} min</span>}
              {movie.vote_average > 0 && (
                <span className="detail-chip detail-chip--gold">★ {movie.vote_average.toFixed(1)} TMDB</span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="detail-genres">
                {genres.map((g) => <span key={g} className="detail-genre">{g}</span>)}
              </div>
            )}

            {movie.director && (
              <p className="detail-director">
                <span className="detail-field-label">Director</span> {movie.director}
              </p>
            )}

            {cast.length > 0 && (
              <p className="detail-cast">
                <span className="detail-field-label">Reparto</span> {cast.join(', ')}
              </p>
            )}

            {movie.overview && (
              <p className="detail-overview">{movie.overview}</p>
            )}

            {movie.personal_rating > 0 && (
              <div className="detail-personal-rating">
                <span className="detail-field-label">Mi calificación</span>
                <StarRow value={movie.personal_rating} />
              </div>
            )}

            {movie.notes && (
              <div className="detail-notes">
                <span className="detail-field-label">Mis notas</span>
                <p>{movie.notes}</p>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn btn-ghost" onClick={() => { onEdit(movie); onClose(); }}>
                ✏️ Editar
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
