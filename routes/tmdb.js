import axios from 'axios';
import { verifyToken } from '../libs/firebaseAdmin';

const TMDB_BASE = 'https://api.themoviedb.org/3';

module.exports = (app) => {
  app.get('/tmdb/search', verifyToken, async (req, res) => {
    const { query } = req.query;
    if (!query || !query.trim()) return res.json({ results: [] });
    try {
      const { data } = await axios.get(TMDB_BASE + '/search/movie', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: query.trim(),
          language: 'es-ES',
          include_adult: false,
          page: 1,
        },
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'TMDB search failed', details: err.message });
    }
  });

  app.get('/tmdb/movie/:id', verifyToken, async (req, res) => {
    try {
      const [detailsRes, creditsRes] = await Promise.all([
        axios.get(TMDB_BASE + '/movie/' + req.params.id, {
          params: { api_key: process.env.TMDB_API_KEY, language: 'es-ES' },
        }),
        axios.get(TMDB_BASE + '/movie/' + req.params.id + '/credits', {
          params: { api_key: process.env.TMDB_API_KEY },
        }),
      ]);
      const director = creditsRes.data.crew.find(function(p) { return p.job === 'Director'; });
      const cast = creditsRes.data.cast.slice(0, 5).map(function(a) { return a.name; });
      const result = Object.assign({}, detailsRes.data, {
        director: director ? director.name : 'Desconocido',
        cast: cast,
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'TMDB fetch failed', details: err.message });
    }
  });
};
