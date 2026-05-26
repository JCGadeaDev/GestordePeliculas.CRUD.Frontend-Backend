import React, { useState, useEffect, useRef, useCallback } from 'react';
import tmdbService, { posterUrl } from '../services/tmdbService';
import './AddMovieModal.css';

const INITIAL_FORM = {
  title: '', year: '', overview: '', director: '',
  poster_path: '', backdrop_path: '', genres: [],
  runtime: '', vote_average: '', tmdb_id: null,
  status: 'pending', personal_rating: 0, notes: '',
};

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        className={`star-btn ${n <= value ? 'star-btn--on' : ''}`}
        onClick={() => onChange(n === value ? 0 : n)}
      >
        ★
      </button>
    ))}
    {value > 0 && <span className="star-clear" onClick={() => onChange(0)}>✕</span>}
  </div>
);

const AddMovieModal = ({ onSave, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState('search'); // 'search' | 'configure'
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await tmdbService.search(query);
        setResults(data.slice(0, 8));
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  const handleSelectResult = useCallback(async (result) => {
    setSearching(true);
    try {
      const details = await tmdbService.getDetails(result.id);
      const year = details.release_date ? parseInt(details.release_date.slice(0, 4)) : '';
      setForm({
        title: details.title,
        year,
        overview: details.overview || '',
        director: details.director || '',
        poster_path: details.poster_path || '',
        backdrop_path: details.backdrop_path || '',
        genres: details.genres || [],
        runtime: details.runtime || '',
        vote_average: details.vote_average || 0,
        tmdb_id: details.id,
        cast: details.cast || [],
        status: 'pending',
        personal_rating: 0,
        notes: '',
      });
      setMode('configure');
    } catch { alert('Error al obtener detalles de la película.'); }
    finally { setSearching(false); }
  }, []);

  const handleManual = () => {
    setForm({ ...INITIAL_FORM, title: query });
    setMode('configure');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, year: form.year ? parseInt(form.year) : undefined });
      onClose();
    } catch { alert('Error al guardar.'); }
    finally { setSaving(false); }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'search' ? '🔍 Buscar película' : '🎬 Configurar película'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {mode === 'search' ? (
          <div className="modal-body">
            <div className="search-field">
              <input
                ref={inputRef}
                type="text"
                placeholder="Escribí el título de la película..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              {searching && <span className="search-spinner" />}
            </div>

            {results.length > 0 && (
              <div className="search-results">
                {results.map((r) => (
                  <button key={r.id} className="result-item" onClick={() => handleSelectResult(r)}>
                    {r.poster_path ? (
                      <img src={posterUrl(r.poster_path, 'w92')} alt={r.title} className="result-poster" />
                    ) : (
                      <div className="result-poster result-poster--empty">🎬</div>
                    )}
                    <div className="result-info">
                      <span className="result-title">{r.title}</span>
                      <span className="result-year">{r.release_date?.slice(0, 4)}</span>
                      {r.vote_average > 0 && (
                        <span className="result-rating">★ {r.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && !searching && results.length === 0 && (
              <p className="search-no-results">Sin resultados en TMDB.</p>
            )}

            {query.length >= 2 && (
              <button className="btn-manual" onClick={handleManual}>
                ✏️ Agregar "{query}" manualmente
              </button>
            )}
          </div>
        ) : (
          <form className="modal-body configure-form" onSubmit={handleSubmit}>
            <div className="configure-layout">
              {form.poster_path && (
                <div className="configure-poster">
                  <img src={posterUrl(form.poster_path)} alt={form.title} />
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
                {form.overview && (
                  <div className="field-group">
                    <label>Sinopsis</label>
                    <textarea value={form.overview} onChange={set('overview')} rows={3} readOnly={!!form.tmdb_id} />
                  </div>
                )}

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
                  <textarea
                    value={form.notes}
                    onChange={set('notes')}
                    rows={2}
                    placeholder="Comentarios, cita favorita, con quién la viste..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setMode('search')}>
                ← Volver
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando…' : '💾 Guardar película'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMovieModal;
