#!/bin/bash

echo "🎬 Iniciando Movie Manager - Full Stack Application"
echo "=================================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Advertencia: MongoDB no parece estar ejecutándose."
    echo "   Asegúrate de iniciar MongoDB antes de continuar."
    echo ""
fi

# Function to cleanup processes on script exit
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend
echo "🚀 Iniciando backend en puerto 3000..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Iniciando frontend en puerto 3001..."
cd frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Aplicación iniciada exitosamente!"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:3001"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"

# Wait for both processes
wait