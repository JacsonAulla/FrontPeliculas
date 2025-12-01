import axios from 'axios';

// --- CAMBIO: Detección automática del entorno ---
// En Netlify usará la variable VITE_API_URL, en tu PC usará localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/auth`;

export default {
    async login(identifier, password) {
        const response = await axios.post(`${API_URL}/login`, { identifier, password });
        return response.data;
    },

    async loginWithGoogle(googleToken) {
        const response = await axios.post(`${API_URL}/google`, { token: googleToken });
        return response.data;
    },

    // --- REGISTRO (NUEVO) ---

    // Paso 1: Enviar datos iniciales
    async registerInit(user) {
        // user debe tener: email, username, fechaNacimiento
        const response = await axios.post(`${API_URL}/register`, user);
        return response.data;
    },

    // Paso 2: Enviar código de verificación
    async verifyCode(email, code) {
        const response = await axios.post(`${API_URL}/verify`, {
            email,
            verificationCode: code
        });
        return response.data;
    },

    // Paso 3: Crear contraseña
    async setPassword(email, password) {
        const response = await axios.post(`${API_URL}/set-password`, {
            email,
            password
        });
        return response.data;
    }
};