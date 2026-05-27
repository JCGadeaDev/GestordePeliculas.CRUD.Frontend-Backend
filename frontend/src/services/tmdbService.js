import axios from 'axios';
import { auth } from '../firebase';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

const authHeaders = async () => {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const tmdbService = {
  search: async (query) => {
    if (!query || query.trim().length < 2) return [];
    const headers = await authHeaders();
    const { data } = await axios.get(`${API}/tmdb/search`, { params: { query }, headers });
    return data.results || [];
  },
  getDetails: async (tmdbId) => {
    const headers = await authHeaders();
    const { data } = await axios.get(`${API}/tmdb/movie/${tmdbId}`, { headers });
    return data;
  },
};

export const posterUrl = (path, size = 'w342') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export default tmdbService;
