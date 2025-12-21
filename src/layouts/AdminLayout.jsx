import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Film, Tv, Radio, List, LogOut, LayoutDashboard, Users } from 'lucide-react'; // <--- 1. Importar Users
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/peliculas', label: 'Películas', icon: <Film size={20} /> },
        { path: '/admin/series', label: 'Series', icon: <Tv size={20} /> },
        { path: '/admin/canales', label: 'Canales', icon: <Radio size={20} /> },
        { path: '/admin/generos', label: 'Géneros', icon: <List size={20} /> },

        // --- 2. Nuevo Ítem: Usuarios ---
        { path: '/admin/usuarios', label: 'Usuarios', icon: <Users size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-weseco-950 text-white">
            {/* Sidebar Fija */}
            <aside className="w-64 bg-weseco-900 border-r border-weseco-800 flex flex-col">
                <Link to="/" className="block p-6 border-b border-weseco-800 hover:bg-weseco-800/50 transition cursor-pointer group">
                    <h2 className="text-xl font-bold text-white tracking-wide group-hover:text-gray-200">
                        Admin Panel
                    </h2>
                    <p className="text-xs text-weseco-400 mt-1 group-hover:text-gray-300">
                        Volver al Sitio
                    </p>
                </Link>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${isActive
                                    ? 'bg-weseco-100 text-weseco-950 font-semibold'
                                    : 'text-weseco-400 hover:bg-weseco-800 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-weseco-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-500/10 rounded transition"
                    >
                        <LogOut size={20} />
                        <span>Salir</span>
                    </button>
                </div>
            </aside>

            {/* Área de Contenido Principal */}
            <main className="flex-1 overflow-auto bg-weseco-950 p-8">
                <Outlet /> {/* Aquí se renderizarán las tablas y formularios */}
            </main>
        </div>
    );
};