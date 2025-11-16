# 🎬 Movie Manager - Full Stack Application

Una aplicación completa para gestionar películas con backend en Node.js y frontend en React.

## 🚀 Características

- **Backend (Node.js + Express + MongoDB)**
  - API RESTful con operaciones CRUD
  - Base de datos MongoDB con MongoJS
  - Middleware para CORS y parsing de JSON

- **Frontend (React)**
  - Interfaz moderna y responsiva
  - Operaciones CRUD completas
  - Formularios para agregar/editar películas
  - Lista de películas con acciones de edición y eliminación

## 📋 Prerequisitos

- Node.js (versión 12 o superior)
- MongoDB (instalado y ejecutándose)
- npm o yarn

## 🛠️ Instalación y Configuración

### Backend

1. Instala las dependencias del backend:
```bash
yarn install
```

2. Asegúrate de que MongoDB esté ejecutándose en tu sistema.

3. Ejecuta el backend:
```bash
yarn start
```

El backend estará disponible en `http://localhost:3000`

### Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
yarn install
```

3. Ejecuta el frontend:
```bash
yarn start
```

El frontend estará disponible en `http://localhost:3001`

## 🔌 API Endpoints

- `GET /movies` - Obtener todas las películas
- `POST /movies` - Crear una nueva película
- `PUT /movies/:id` - Actualizar una película por ID
- `DELETE /movies/:id` - Eliminar una película por ID

### Estructura de datos de película:
```json
{
  "title": "Nombre de la película",
  "year": 2023
}
```

## 🎯 Uso

1. **Agregar película**: Completa el formulario en la parte superior y haz clic en "Agregar"
2. **Editar película**: Haz clic en el botón de editar (✏️) en cualquier película
3. **Eliminar película**: Haz clic en el botón de eliminar (🗑️) y confirma la acción

## 🏗️ Estructura del Proyecto

```
/
├── backend/
│   ├── index.js              # Punto de entrada del servidor
│   ├── package.json          # Dependencias del backend
│   ├── routes/
│   │   └── movies.js         # Rutas de la API de películas
│   └── libs/
│       ├── middleware.js     # Configuración de middleware
│       └── boots.js          # Configuración del servidor
└── frontend/
    ├── src/
    │   ├── App.js            # Componente principal
    │   ├── components/       # Componentes React
    │   └── services/         # Servicios de API
    └── package.json          # Dependencias del frontend
```

## 🎨 Tecnologías Utilizadas

### Backend
- Express.js
- MongoDB con MongoJS
- Body-parser
- Babel (ES6+)

### Frontend
- React
- Axios (para peticiones HTTP)
- CSS3 con diseño moderno
- Responsive design

## 🔧 Desarrollo

Para desarrollo, ejecuta ambos servidores simultáneamente:

Terminal 1 (Backend):
```bash
yarn start
```

Terminal 2 (Frontend):
```bash
cd frontend && yarn start
```

## 📱 Características del Frontend

- **Diseño Responsivo**: Funciona perfectamente en desktop y móviles
- **UI Moderna**: Gradientes, sombras y animaciones suaves
- **UX Intuitiva**: Formularios claros y acciones obvias
- **Manejo de Estados**: Loading states y manejo de errores
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas

## 🚨 Solución de Problemas

1. **Error de CORS**: Asegúrate de que el backend esté ejecutándose antes que el frontend
2. **Error de conexión**: Verifica que MongoDB esté ejecutándose
3. **Puerto ocupado**: Cambia el puerto en `libs/middleware.js` si es necesario

## 📄 Licencia

MIT