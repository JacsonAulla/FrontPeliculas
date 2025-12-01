import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
// Si existe la variable de entorno (en la nube), úsala. Si no, usa localhost.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/admin/users`;

// Función auxiliar para obtener el Header con el Token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
    // 1. Listar usuarios (con paginación)
    async getAllUsers(page = 0, size = 5) {
        // Spring Boot usa páginas base 0.
        // Enviamos page, size y ordenamos por ID descendente (los nuevos primero)
        const response = await axios.get(`${API_URL}?page=${page}&size=${size}&sort=id,desc`, getAuthHeader());
        return response.data;
    },

    // 2. Banear / Desbanear
    async toggleStatus(userId) {
        const response = await axios.patch(`${API_URL}/${userId}/status`, {}, getAuthHeader());
        return response.data;
    },

    // 3. Cambiar Rol
    async changeRole(userId, newRole) {
        // newRole debe ser "ROLE_ADMIN" o "ROLE_USUARIO"
        const response = await axios.patch(`${API_URL}/${userId}/role?roleName=${newRole}`, {}, getAuthHeader());
        return response.data;
    }
};