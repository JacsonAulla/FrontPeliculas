import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react'; // Iconos bonitos

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(username, password);

        if (result.success) {
            navigate('/'); // Si sale bien, vamos al Home
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-weseco-950 px-4">

            {/* Tarjeta Minimalista */}
            <div className="w-full max-w-md bg-weseco-900 border border-weseco-800 p-8 rounded-lg shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
                    <p className="text-weseco-400 text-sm mt-2">Ingresa a tu cuenta privada</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Input Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-weseco-400 mb-2">Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-weseco-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-weseco-950 border border-weseco-800 text-white text-sm rounded-md focus:ring-1 focus:ring-white focus:border-white block pl-10 p-2.5 outline-none transition-colors"
                                placeholder="Tu nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Input Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-weseco-400 mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-weseco-400" />
                            </div>
                            <input
                                type="password"
                                className="w-full bg-weseco-950 border border-weseco-800 text-white text-sm rounded-md focus:ring-1 focus:ring-white focus:border-white block pl-10 p-2.5 outline-none transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {/* Botón Minimalista (Blanco sobre negro) */}
                    <button
                        type="submit"
                        className="w-full text-weseco-950 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition-all duration-200"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};