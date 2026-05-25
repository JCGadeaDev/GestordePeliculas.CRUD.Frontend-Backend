import React, { useState } from 'react';
import { posterUrl } from '../services/tmdbService';
import './AddMovieModal.css';

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        className={`star-btn ${n <= value ? 'star-btn--on' : ''}`}
        onClick={() => onChange(n === value ? 0 : n)}
      >★</button>
    ))}
    {value > 0 && <span className="star-clear" onClick={() => onChange(0)}>✕</span>}
  </div>
);

const EditMovieModal = ({ movie, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: movie.title || '',
    year: movie.year || '',
    director: movie.director || '',
    overview: movie.overview || '',
    runtime: movie.runtime || '',
    status: movie.status || 'pending',
    personal_rating: movie.personal_rating || 0,
    notes: movie.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(movie._id, { ...movie, ...form, year: form.year ? parseInt(form.year) : undefined });
      onClose();
    } catch { alert('Error al guardar.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar película</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body configure-form" onSubmit={handleSubmit}>
          <div className="configure-layout">
            {movie.poster_path && (
              <div className="configure-poster">
                <img src={posterUrl(movie.poster_path)} alt={movie.title} />
              </div>
            )}

            <div className="configure-fields">
              <div className="field-group">
                <label>Título</label>
                <input type="text" value={form.title} onChange={set('title')} required />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Año</label>
                  <input type="number" value={form.year} onChange={set('year')} min="1880" max="2030" />
                </div>
                <div className="field-group">
                  <label>Duración (min)</label>
                  <input type="number" value={form.runtime} onChange={set('runtime')} min="0" />
                </div>
              </div>
              <div className="field-group">
                <label>Director</label>
                <input type="text" value={form.director} onChange={set('director')} />
              </div>
              <div className="field-group">
                <label>Sinopsis</label>
                <textarea value={form.overview} onChange={set('overview')} rows={3} />
              </div>

              <hr className="field-divider" />
              <p className="field-section-title">Tu opinión</p>

              <div className="field-group">
                <label>Estado</label>
                <div className="status-picker">
                  {[['pending','⏳','Pendiente'],['watched','✓','Vista'],['favorite','♥','Favorita']].map(([val, icon, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      className={`status-option status-option--${val} ${form.status === val ? 'status-option--active' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, status: val }))}
                    >
                      {icon} {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label>Mi calificación</label>
                <StarPicker value={form.personal_rating} onChange={(v) => setForm((f) => ({ ...f, personal_rating: v }))} />
              </div>

              <div className="field-group">
                <label>Notas personales</label>
                <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Comentarios, cita favorita..." />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : '💾 Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;
