# Movie Vault 🎬

Gestor de películas personal full-stack con autenticación Firebase, integración a TMDB y diseño dark Netflix-style.

## Demo

- **Frontend (Vercel):** `https://tu-app.vercel.app`
- **Backend API (Render):** `https://tu-backend.onrender.com`

> El backend usa el free tier de Render — el primer request después de 15 min de inactividad puede tardar ~30s en despertar.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, CSS custom properties |
| Backend | Node.js + Express + Babel |
| Autenticación | Firebase Auth (Google + Email/Password) |
| Base de datos | MongoDB Atlas |
| API externa | TMDB (The Movie Database) |
| Deploy frontend | Vercel |
| Deploy backend | Render |

## Funcionalidades

- Login con Google o email/contraseña (Firebase Auth)
- Sistema de roles: **Admin** (CRUD completo) y **Viewer** (solo lectura)
- Búsqueda en tiempo real de películas vía TMDB al agregar
- Pósters, sinopsis, director, reparto y rating de TMDB
- Estado personal: **Vista / Pendiente / Favorita**
- Calificación personal con estrellas (1–5)
- Notas personales por película
- Filtros por estado, género y búsqueda en la colección
- Ordenamiento por título, año, rating TMDB o rating personal
- Stats en tiempo real en el header
- Modal de detalle con backdrop de TMDB
- Animación skeleton mientras carga
- Diseño responsivo

## Sistema de roles

| Rol | Asignación | Permisos |
|---|---|---|
| `admin` | Emails listados en `ADMIN_EMAILS` | Ver + Agregar + Editar + Eliminar |
| `viewer` | Cualquier otro usuario registrado | Solo lectura |

Al primer login, el sistema crea automáticamente el perfil del usuario con el rol correspondiente.

## Desarrollo local

### Requisitos

- Node.js 18
- MongoDB corriendo localmente (`mongod`)
- Proyecto Firebase con Authentication habilitado
- API key de TMDB

### Variables de entorno — Backend

Copiá `.env.example` a `.env` en la raíz y completá los valores:

```
TMDB_API_KEY=             # API key de themoviedb.org
MONGODB_URI=              # Connection string de MongoDB Atlas o local
FIREBASE_PROJECT_ID=      # ID del proyecto Firebase
FIREBASE_CLIENT_EMAIL=    # Email del service account
FIREBASE_PRIVATE_KEY=     # Clave privada del service account (entre comillas)
ADMIN_EMAILS=             # Emails con rol admin, separados por coma
```

> ⚠️ El archivo `.env` y el JSON del service account de Firebase están en `.gitignore`. Nunca los commitees.

### Variables de entorno — Frontend

Completá `frontend/.env`:

```
PORT=3001
REACT_APP_API_URL=        # URL del backend (http://localhost:3000 en local)
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_APP_ID=
```

> Los valores `REACT_APP_FIREBASE_*` se obtienen en Firebase Console → Project Settings → General → Your apps.

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

## Deploy

### Firebase (setup previo)

1. Crear proyecto en https://console.firebase.google.com
2. **Authentication** → habilitar **Google** y **Email/contraseña**
3. **Project Settings → General → Add app (Web)** → copiar el objeto `firebaseConfig`
4. **Project Settings → Service accounts → Generate new private key** → usar los valores en las env vars del backend
5. **Authentication → Settings → Authorized domains** → agregar el dominio de Vercel

### MongoDB Atlas

1. Crear cluster M0 (free) en https://cloud.mongodb.com
2. Crear usuario con permisos de lectura/escritura
3. Agregar IP `0.0.0.0/0` en Network Access (necesario para Render)
4. Copiar connection string y usarlo como `MONGODB_URI`

### Backend → Render

- Build Command: `yarn install`
- Start Command: `yarn start`
- Node Version: `18` (env var `NODE_VERSION=18`)
- Variables requeridas: `TMDB_API_KEY`, `MONGODB_URI`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `ADMIN_EMAILS`

### Frontend → Vercel

- Root Directory: `frontend`
- Framework: Create React App
- Build Command: `react-scripts build`
- Variables requeridas: `REACT_APP_API_URL`, `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_APP_ID`

## API Endpoints

Todos los endpoints requieren autenticación (header `Authorization: Bearer <token>`). Los de escritura requieren rol `admin`.

| Método | Ruta | Rol mínimo | Descripción |
|---|---|---|---|
| GET | `/movies` | viewer | Obtener todas las películas |
| POST | `/movies` | admin | Agregar película |
| PUT | `/movies/:id` | admin | Actualizar película |
| DELETE | `/movies/:id` | admin | Eliminar película |
| GET | `/tmdb/search?query=` | viewer | Buscar en TMDB |
| GET | `/tmdb/movie/:id` | viewer | Detalle + créditos de TMDB |
| GET | `/users/me` | viewer | Perfil y rol del usuario autenticado |

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
