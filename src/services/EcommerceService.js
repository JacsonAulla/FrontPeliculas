import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Construimos la ruta específica para e-commerce
const API_URL = `${BASE_URL}/ecommerce`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
    // --- CARRITO ---
    async getCart() {
        const response = await axios.get(`${API_URL}/cart`, getAuthHeader());
        return response.data;
    },

    async addToCart(contenidoId) {
        const response = await axios.post(`${API_URL}/cart/add/${contenidoId}`, {}, getAuthHeader());
        return response.data;
    },

    async removeFromCart(itemId) {
        const response = await axios.delete(`${API_URL}/cart/remove/${itemId}`, getAuthHeader());
        return response.data;
    },

    async checkout() {
        const response = await axios.post(`${API_URL}/checkout`, {}, getAuthHeader());
        return response.data;
    },

    // --- SUSCRIPCIONES ---
    async getSubscriptionStatus() {
        const response = await axios.get(`${API_URL}/subscription`, getAuthHeader());
        return response.data;
    },

    async subscribe(planId) {
        const response = await axios.post(`${API_URL}/subscribe/${planId}`, {}, getAuthHeader());
        return response.data;
    },

    // --- ACCESO ---
    async checkAccess(contenidoId) {
        const response = await axios.get(`${API_URL}/check-access/${contenidoId}`, getAuthHeader());
        return response.data.hasAccess; // Devuelve true o false
    },

    async getLibrary() {
        const response = await axios.get(`${API_URL}/library`, getAuthHeader());
        return response.data;
    }
};