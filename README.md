# Tic Tac Toe Online (Fullstack con Socket.IO)

Aplicación multijugador online de Tic Tac Toe desarrollada con React (Vite) en el frontend, Node.js + Express + Socket.IO en el backend, y base de datos en MongoDB Atlas.  
El proyecto está dockerizado y desplegado en Render.

## Demo en línea

- Frontend: https://tictactoe-frontend-xcrn.onrender.com/ 
- Backend: https://tictactoe-backend-m16j.onrender.com

## Tecnologías principales

Frontend:
- React + Vite + TypeScript
- TailwindCSS
- Socket.IO Client

Backend:
- Node.js + Express
- Socket.IO Server
- MongoDB Atlas
- Docker

## Instalación y ejecución local

1. Clonar el repositorio

```
git clone https://github.com/tuusuario/tictactoe-socket-app.git
cd tictactoe-socket-app
```

2. Backend

```
cd backend
npm install
```

Crear un archivo .env en backend/ basado en .env.example:
```
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/tictactoe
PORT=4000
```

Ejecutar en modo desarrollo:
```
npm run dev
```

El backend quedará corriendo en:
http://localhost:4000

3. Frontend

```
cd ../frontend
npm install
```

Crear un archivo .env en frontend/ basado en .env.example:
```
VITE_BACKEND_URL=http://localhost:4000
```

Ejecutar en modo desarrollo:
```
npm run dev
```

Abrir en navegador:
http://localhost:5173

4. (Opcional) Ejecución con Docker
```
docker-compose up --build
```

Esto levanta tanto el backend como el frontend automáticamente.
