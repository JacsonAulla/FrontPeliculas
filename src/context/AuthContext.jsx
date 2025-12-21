import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importante: instala esto si falla (npm install jwt-decode)
import api from '../api/axiosConfig';

const AuthContext = createContext();

// Hook personalizado para usar el contexto fácil
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Al cargar la página, verificamos si hay un token guardado
    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Verificar si expiró (exp viene en segundos)
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setUser({
                            username: decoded.sub,
                            rol: decoded.rol || 'ROLE_USUARIO' // Asumiendo que tu backend manda el rol
                        });
                    }
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkLogin();
    }, []);

    const login = async (username, password) => {
        try {
            // Petición al Backend
            const response = await api.post('/auth/login', { username, password });

            // Si es exitoso:
            const { token, username: userRes, rol } = response.data;

            // 1. Guardar en disco
            localStorage.setItem('token', token);

            // 2. Guardar en estado de la app
            setUser({ username: userRes, rol });

            return { success: true };
        } catch (error) {
            console.error("Error Login:", error);
            return {
                success: false,
                message: "Usuario o contraseña incorrectos."
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};