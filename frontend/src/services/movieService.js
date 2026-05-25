import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const movieService = {
  getAll: async () => {
    const { data } = await axios.get(`${API}/movies`);
    return data.movies || [];
  },
  create: async (movieData) => {
    const { data } = await axios.post(`${API}/movies`, movieData);
    return data.movie;
  },
  update: async (id, movieData) => {
    const { data } = await axios.put(`${API}/movies/${id}`, movieData);
    return data.response;
  },
  remove: async (id) => {
    const { data } = await axios.delete(`${API}/movies/${id}`);
    return data.response;
  },
};

export default movieService;
