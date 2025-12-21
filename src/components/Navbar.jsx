import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // <--- Importante
import { LogOut, MonitorPlay, LayoutDashboard } from 'lucide-react'; // <--- Agregamos LayoutDashboard

export const Navbar = () => {
    const { logout, user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-weseco-950/90 backdrop-blur-md border-b border-weseco-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo / Título (Link al Home) */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <MonitorPlay className="text-white" size={28} />
                        <span className="font-bold text-xl tracking-tight text-white">
                            MediaWeseco
                        </span>
                    </Link>

                    {/* Zona Derecha */}
                    <div className="flex items-center gap-4">

                        {/* BOTÓN ADMIN (Solo visible para ROLE_ADMIN) */}
                        {user?.rol === 'ROLE_ADMIN' && (
                            <Link
                                to="/admin/peliculas"
                                className="hidden sm:flex items-center gap-2 bg-weseco-800 hover:bg-white hover:text-black text-white px-3 py-1.5 rounded-md transition-all text-sm font-medium"
                            >
                                <LayoutDashboard size={16} />
                                <span>Panel Admin</span>
                            </Link>
                        )}

                        {/* Saludo */}
                        <span className="text-sm text-weseco-400 hidden md:block">
                            Hola, {user?.username}
                        </span>

                        {/* Botón Salir */}
                        <button
                            onClick={logout}
                            className="p-2 text-weseco-400 hover:text-red-500 hover:bg-weseco-800 rounded-full transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};