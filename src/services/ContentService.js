import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
// Si hay variable de entorno (Nube) la usa, si no, usa localhost.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
    // Traer películas (Paginado)
    async getPeliculas(page = 0, size = 10) {
        const url = `${BASE_URL}/peliculas?page=${page}&size=${size}&sort=anioLanzamiento,desc`;
        const response = await axios.get(url, getAuthHeader());
        return response.data;
    },

    // --- NUEVO: Traer una sola película por ID ---
    async getById(id) {
        const response = await axios.get(`${BASE_URL}/peliculas/${id}`, getAuthHeader());
        return response.data;
    }
};