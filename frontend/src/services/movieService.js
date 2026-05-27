import axios from 'axios';
import { auth } from '../firebase';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const authHeaders = async () => {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const movieService = {
  getAll: async () => {
    const headers = await authHeaders();
    const { data } = await axios.get(`${API}/movies`, { headers });
    return data.movies || [];
  },
  create: async (movieData) => {
    const headers = await authHeaders();
    const { data } = await axios.post(`${API}/movies`, movieData, { headers });
    return data.movie;
  },
  update: async (id, movieData) => {
    const headers = await authHeaders();
    const { data } = await axios.put(`${API}/movies/${id}`, movieData, { headers });
    return data.response;
  },
  remove: async (id) => {
    const headers = await authHeaders();
    const { data } = await axios.delete(`${API}/movies/${id}`, { headers });
    return data.response;
  },
};

export default movieService;
