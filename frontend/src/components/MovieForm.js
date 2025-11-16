import React, { useState, useEffect } from 'react';
import './MovieForm.css';

const MovieForm = ({ movie, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    year: ''
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        year: movie.year || ''
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.year.trim()) {
      onSubmit({
        ...formData,
        year: parseInt(formData.year)
      });
      if (!isEditing) {
        setFormData({ title: '', year: '' });
      }
    }
  };

  return (
    <div className="movie-form-container">
      <h2>{isEditing ? 'Editar Película' : 'Agregar Nueva Película'}</h2>
      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ingresa el título de la película"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="year">Año:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Ingresa el año"
            min="1900"
            max="2030"
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Actualizar' : 'Agregar'}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MovieForm;