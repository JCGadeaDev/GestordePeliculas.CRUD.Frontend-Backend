# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack movie manager with a Node.js/Express/MongoDB backend and a React frontend. Features a dark Netflix-style UI, TMDB API integration for movie data (posters, synopsis, cast, ratings), personal status/ratings/notes, and full filtering/sorting. Both services run as separate processes communicating over HTTP.

## Commands

### Setup — Backend API key

Copy `.env.example` to `.env` and add your TMDB API key:
```
TMDB_API_KEY=your_key_here
```
Get a free key at https://www.themoviedb.org/settings/api

### Backend (root directory)

```bash
yarn install        # install dependencies
yarn start          # starts server via babel-node on port 3000
```

### Frontend (`frontend/` directory)

```bash
cd frontend
yarn install        # install dependencies
yarn start          # starts dev server on port 3001
yarn build          # production build
yarn test           # run tests (react-scripts test)
yarn test -- --testPathPattern=App  # run a single test file
```

Both servers must be running simultaneously for the app to work. Backend must start before frontend.

## Architecture

### Backend

- **Entry point**: `index.js` — loads `dotenv/config` then wires the app via `consign`:
  1. `libs/middleware.js` — port 3000, wildcard CORS, body-parser JSON/urlencoded
  2. `routes/` (auto-loaded) — `movies.js` (CRUD) + `tmdb.js` (TMDB proxy)
  3. `libs/boots.js` — `app.listen()`

- **TMDB proxy** (`routes/tmdb.js`): `GET /tmdb/search?query=` and `GET /tmdb/movie/:id` — hides the API key server-side and merges credits (director, top-5 cast) into the movie details response.

- **Database**: `routes/movies.js` connects directly to MongoDB via `mongojs` (`moviesdb` DB, `movies` collection). No ORM; stores whatever the frontend sends. Fields: `tmdb_id`, `poster_path`, `backdrop_path`, `overview`, `genres`, `runtime`, `director`, `vote_average`, `cast`, `status` (pending/watched/favorite), `personal_rating` (0–5), `notes`, `added_at`.

- **Babel**: `.babelrc` uses `babel-preset-env` targeting `node: current` — supports async/await in route files.

### Frontend

- **Entry**: `frontend/src/index.js` → `frontend/src/App.js`
- **State**: All state in `App.js`. Filtering/sorting done client-side via `useMemo`. No external state library.
- **Services**: `movieService.js` (backend CRUD) + `tmdbService.js` (TMDB proxy calls + image URL helpers `posterUrl`, `backdropUrl`).
- **Components**:
  - `Header` — logo, stats pills (total/watched/pending/favorites/avg rating), "+ Agregar" button
  - `FilterBar` — text search, status chips, genre chips, sort dropdown
  - `MovieGrid` — responsive CSS grid; shows skeleton animation while loading
  - `MovieCard` — poster image (2:3 ratio), status/TMDB-rating badges, hover overlay with synopsis + actions
  - `AddMovieModal` — two-step: TMDB search → select → configure personal fields (status, stars, notes)
  - `EditMovieModal` — edit all fields of existing movie (shares CSS with AddMovieModal)
  - `MovieDetailModal` — backdrop image header, full synopsis, cast, personal rating/notes

### Data model

```json
{
  "_id": "ObjectId", "tmdb_id": 123, "title": "...", "year": 2020,
  "overview": "...", "poster_path": "/...", "backdrop_path": "/...",
  "genres": [{"id": 28, "name": "Action"}], "runtime": 148,
  "director": "...", "cast": ["Actor1", "..."], "vote_average": 8.5,
  "status": "watched|pending|favorite", "personal_rating": 4,
  "notes": "...", "added_at": "ISO date"
}
```

TMDB image URLs are built by helpers in `tmdbService.js`: `posterUrl(path, size?)` and `backdropUrl(path, size?)`.

## Key constraints

- **TMDB API key** must be in `.env` at root (copy `.env.example`). Without it, the proxy routes return 500.
- `mongojs` requires MongoDB running locally at `localhost:27017`. Database name: `moviesdb`.
- CORS is wide-open (`*`) — intentional for local dev.
- Backend port (3000) is hardcoded in `libs/middleware.js` and in both frontend service files.
- Frontend always starts on port 3001 (configured via `frontend/.env`).
