import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import MovieGrid from './components/MovieGrid';
import AddMovieModal from './components/AddMovieModal';
import EditMovieModal from './components/EditMovieModal';
import MovieDetailModal from './components/MovieDetailModal';
import movieService from './services/movieService';
import './App.css';

const computeStats = (movies) => {
  const watched = movies.filter((m) => m.status === 'watched').length;
  const favorites = movies.filter((m) => m.status === 'favorite').length;
  const pending = movies.filter((m) => m.status === 'pending').length;
  const rated = movies.filter((m) => m.personal_rating > 0);
  const avgRating = rated.length
    ? (rated.reduce((s, m) => s + m.personal_rating, 0) / rated.length).toFixed(1)
    : 0;
  return { total: movies.length, watched, favorites, pending, avgRating };
};

const extractGenres = (movies) => {
  const set = new Set();
  movies.forEach((m) => {
    (m.genres || []).forEach((g) => {
      const name = typeof g === 'object' ? g.name : g;
      if (name) set.add(name);
    });
  });
  return Array.from(set).sort();
};

const applyFilters = (movies, { search, status, genre, sortBy }) => {
  let result = [...movies];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) => m.title?.toLowerCase().includes(q) || m.director?.toLowerCase().includes(q)
    );
  }

  if (status !== 'all') result = result.filter((m) => m.status === status);

  if (genre !== 'all') {
    result = result.filter((m) =>
      (m.genres || []).some((g) => (typeof g === 'object' ? g.name : g) === genre)
    );
  }

  result.sort((a, b) => {
    switch (sortBy) {
      case 'title':         return (a.title || '').localeCompare(b.title || '');
      case 'year_desc':     return (b.year || 0) - (a.year || 0);
      case 'year_asc':      return (a.year || 0) - (b.year || 0);
      case 'vote_average':  return (b.vote_average || 0) - (a.vote_average || 0);
      case 'personal_rating': return (b.personal_rating || 0) - (a.personal_rating || 0);
      default:              return new Date(b.added_at || 0) - new Date(a.added_at || 0);
    }
  });

  return result;
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [detailMovie, setDetailMovie] = useState(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('added_at');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAll();
      setMovies(data);
    } catch {
      setError('No se pudo conectar al backend. Asegurate de que esté corriendo en el puerto 3000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (movieData) => {
    await movieService.create(movieData);
    await load();
  };

  const handleUpdate = async (id, movieData) => {
    await movieService.update(id, movieData);
    await load();
    if (detailMovie?._id === id) setDetailMovie(null);
  };

  const handleDelete = async (id) => {
    await movieService.remove(id);
    await load();
  };

  const stats = useMemo(() => computeStats(movies), [movies]);
  const genres = useMemo(() => extractGenres(movies), [movies]);
  const filtered = useMemo(
    () => applyFilters(movies, { search, status, genre, sortBy }),
    [movies, search, status, genre, sortBy]
  );

  return (
    <div className="app">
      <Header stats={stats} onAddClick={() => setShowAdd(true)} />

      <FilterBar
        search={search} onSearchChange={setSearch}
        status={status} onStatusChange={setStatus}
        genre={genre} onGenreChange={setGenre}
        sortBy={sortBy} onSortChange={setSortBy}
        genres={genres}
        totalVisible={filtered.length}
        total={movies.length}
      />

      <main className="app-main">
        {error && (
          <div className="app-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={load}>Reintentar</button>
          </div>
        )}
        <MovieGrid
          movies={filtered}
          loading={loading}
          onEdit={setEditingMovie}
          onDelete={handleDelete}
          onClick={setDetailMovie}
        />
      </main>

      {showAdd && (
        <AddMovieModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editingMovie && (
        <EditMovieModal
          movie={editingMovie}
          onSave={handleUpdate}
          onClose={() => setEditingMovie(null)}
        />
      )}
      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          onEdit={setEditingMovie}
          onDelete={handleDelete}
          onClose={() => setDetailMovie(null)}
        />
      )}
    </div>
  );
}
