# Movie Vault 🎬

Gestor de películas personal full-stack con integración a TMDB, diseño dark Netflix-style y deploy en la nube.

## Demo

- **Frontend (Vercel):** `https://tu-app.vercel.app`
- **Backend API (Render):** `https://tu-backend.onrender.com`

> El backend usa el free tier de Render — el primer request después de 15 min de inactividad puede tardar ~30s en despertar.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, CSS custom properties |
| Backend | Node.js + Express + Babel |
| Base de datos | MongoDB Atlas |
| API externa | TMDB (The Movie Database) |
| Deploy frontend | Vercel |
| Deploy backend | Render |

## Funcionalidades

- Búsqueda en tiempo real de películas vía TMDB al agregar
- Pósters, sinopsis, director, reparto y rating de TMDB
- Estado personal: **Vista / Pendiente / Favorita**
- Calificación personal con estrellas (1–5)
- Notas personales por película
- Filtros por estado, género y búsqueda en tu colección
- Ordenamiento por título, año, rating TMDB o rating personal
- Stats en tiempo real en el header
- Modal de detalle con backdrop de TMDB
- Animación skeleton mientras carga
- Diseño responsivo

## Desarrollo local

### Requisitos

- Node.js 18
- MongoDB corriendo localmente (`mongod`)
- Cuenta en TMDB para la API key

### Variables de entorno

Copiá `.env.example` a `.env` en la raíz:

```
TMDB_API_KEY=tu_api_key
MONGODB_URI=mongodb://localhost:27017/moviesdb   # local
```

### Levantar el backend (raíz del proyecto)

```bash
yarn install
yarn start        # http://localhost:3000
```

### Levantar el frontend (`frontend/`)

```bash
cd frontend
yarn install
yarn start        # http://localhost:3001
```

Ambos servidores deben correr simultáneamente. El backend debe iniciar primero.

### Variable de entorno del frontend (opcional en local)

`frontend/.env` ya tiene `PORT=3001`. Si querés apuntar a un backend remoto:

```
REACT_APP_API_URL=https://movie-vault-api-8qf4.onrender.com
```

Sin esta variable el frontend usa `http://localhost:3000` por defecto.

## Deploy

### MongoDB Atlas
1. Crear cluster M0 (free) en https://cloud.mongodb.com
2. Crear usuario con permisos de lectura/escritura
3. Agregar IP `0.0.0.0/0` en Network Access
4. Copiar connection string: `mongodb+srv://user:pass@cluster.mongodb.net/moviesdb`

### Backend → Render
- Build Command: `yarn install`
- Start Command: `yarn start`
- Node Version: `18` (via env var `NODE_VERSION=18`)
- Variables: `TMDB_API_KEY`, `MONGODB_URI`

### Frontend → Vercel
- Root Directory: `frontend`
- Framework: Create React App
- Variable: `REACT_APP_API_URL=https://tu-backend.onrender.com`

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/movies` | Obtener todas las películas |
| POST | `/movies` | Agregar película |
| PUT | `/movies/:id` | Actualizar película |
| DELETE | `/movies/:id` | Eliminar película |
| GET | `/tmdb/search?query=` | Buscar en TMDB |
| GET | `/tmdb/movie/:id` | Detalle + créditos de TMDB |

## Modelo de datos

```json
{
  "_id": "ObjectId",
  "tmdb_id": 123,
  "title": "Inception",
  "year": 2010,
  "overview": "...",
  "poster_path": "/poster.jpg",
  "backdrop_path": "/backdrop.jpg",
  "genres": [{ "id": 28, "name": "Acción" }],
  "runtime": 148,
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "..."],
  "vote_average": 8.8,
  "status": "watched",
  "personal_rating": 5,
  "notes": "Una obra maestra",
  "added_at": "2024-01-15T..."
}
```
