import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Construimos las rutas específicas usando la base
const API_URL_ADMIN = `${BASE_URL}/admin/canales`;
const API_URL_PUBLIC = `${BASE_URL}/canales`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
    // --- ADMIN ---
    async getAllAdmin(page = 0, size = 10) {
        const response = await axios.get(`${API_URL_ADMIN}?page=${page}&size=${size}&sort=id,desc`, getAuthHeader());
        return response.data;
    },

    async create(canal) {
        const response = await axios.post(API_URL_ADMIN, canal, getAuthHeader());
        return response.data;
    },

    async update(id, canal) {
        const response = await axios.put(`${API_URL_ADMIN}/${id}`, canal, getAuthHeader());
        return response.data;
    },

    async delete(id) {
        const response = await axios.delete(`${API_URL_ADMIN}/${id}`, getAuthHeader());
        return response.data;
    },

    // --- PÚBLICO ---
    async getActiveCanales(page = 0, size = 10) {
        const response = await axios.get(`${API_URL_PUBLIC}?page=${page}&size=${size}`, getAuthHeader());
        return response.data;
    },

    async getById(id) {
        const response = await axios.get(`${API_URL_PUBLIC}/${id}`, getAuthHeader());
        return response.data;
    }
};