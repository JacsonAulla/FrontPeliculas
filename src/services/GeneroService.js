import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Construimos la ruta específica
const API_URL = `${BASE_URL}/admin/generos`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
    // Listar todos
    async getAll() {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    },

    // Crear
    async create(genero) {
        const response = await axios.post(API_URL, genero, getAuthHeader());
        return response.data;
    },

    // Editar
    async update(id, genero) {
        const response = await axios.put(`${API_URL}/${id}`, genero, getAuthHeader());
        return response.data;
    },

    // Eliminar
    async delete(id) {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        return response.data;
    }
};