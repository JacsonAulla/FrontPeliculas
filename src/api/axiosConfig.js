import axios from 'axios';

// ============================================================
// CAMBIO IMPORTANTE PARA PRODUCCIÓN
// ============================================================
// Aquí le decimos: "Busca si existe una variable de entorno llamada VITE_API_URL".
// 1. Si existe (en Vercel), usa esa URL (la de Render).
// 2. Si NO existe (en tu PC), usa 'http://localhost:8080'.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// INTERCEPTOR DE SEGURIDAD (Se queda igual)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;