import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const movieService = {
  // Get all movies
  getAllMovies: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies`);
      return response.data.movies || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Create a new movie
  createMovie: async (movieData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/movies`, movieData);
      return response.data.movie;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  // Update a movie
  updateMovie: async (id, movieData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/movies/${id}`, movieData);
      return response.data.response;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  // Delete a movie
  deleteMovie: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/movies/${id}`);
      return response.data.response;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }
};

export default movieService;