import React, { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieList from './components/MovieList';
import movieService from './services/movieService';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [error, setError] = useState(null);

  // Load movies on component mount
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);
    } catch (err) {
      setError('Error al cargar las películas. Asegúrate de que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (movieData) => {
    try {
      setError(null);
      await movieService.createMovie(movieData);
      await loadMovies(); // Reload the list
    } catch (err) {
      setError('Error al crear la película.');
    }
  };

  const handleUpdateMovie = async (movieData) => {
    try {
      setError(null);
      await movieService.updateMovie(editingMovie._id, movieData);
      setEditingMovie(null);
      await loadMovies(); // Reload the list
    } catch (err) {
      setError('Error al actualizar la película.');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      setError(null);
      await movieService.deleteMovie(movieId);
      await loadMovies(); // Reload the list
    } catch (err) {
      setError('Error al eliminar la película.');
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Gestor de Películas</h1>
        <p>Administra tu colección de películas</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        )}

        <div className="form-section">
          <MovieForm
            movie={editingMovie}
            onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}
            onCancel={handleCancelEdit}
            isEditing={!!editingMovie}
          />
        </div>

        <div className="list-section">
          <MovieList
            movies={movies}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
            loading={loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Frontend conectado al backend de Node.js</p>
      </footer>
    </div>
  );
}

export default App;
