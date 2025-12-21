import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Film, Tv, Radio, Users, Activity, Settings } from 'lucide-react';

export const AdminDashboard = () => {
    const [tiposContenido, setTiposContenido] = useState([]);
    const [stats, setStats] = useState({ pelis: 0, series: 0, canales: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cargar Tipos de Contenido (Tu endpoint nuevo)
                const resTipos = await api.get('/api/tipos-contenido');
                setTiposContenido(resTipos.data);

                // 2. Cargar conteos reales (Opcional: Si quieres datos reales en las tarjetas)
                // Podrías hacer: await api.get('/api/dashboard/stats');
                // Por ahora simularemos o calcularemos si tuviéramos los arrays
            } catch (error) {
                console.error("Error cargando dashboard", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-weseco-400">Resumen general de la plataforma</p>
            </div>

            {/* Tarjetas de Estadísticas (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Películas"
                    value="Gestionar"
                    icon={<Film size={24} className="text-purple-400" />}
                    color="bg-purple-500/10 border-purple-500/20"
                />
                <StatCard
                    title="Series"
                    value="Gestionar"
                    icon={<Tv size={24} className="text-blue-400" />}
                    color="bg-blue-500/10 border-blue-500/20"
                />
                <StatCard
                    title="Canales"
                    value="En vivo"
                    icon={<Radio size={24} className="text-green-400" />}
                    color="bg-green-500/10 border-green-500/20"
                />
                <StatCard
                    title="Usuarios"
                    value="Admin"
                    icon={<Users size={24} className="text-orange-400" />}
                    color="bg-orange-500/10 border-orange-500/20"
                />
            </div>

            {/* Sección Inferior: Tipos de Contenido */}
            <div className="bg-weseco-900 rounded-lg border border-weseco-800 p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-weseco-800 pb-4">
                    <Settings className="text-gray-400" />
                    <h2 className="text-xl font-bold text-white">Configuración del Sistema</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tabla de Tipos de Contenido (Desde tu API) */}
                    <div>
                        <h3 className="text-sm uppercase tracking-wider text-weseco-400 font-semibold mb-4">
                            Tipos de Contenido Definidos
                        </h3>
                        <div className="bg-weseco-950 rounded-lg overflow-hidden border border-weseco-800">
                            <table className="w-full text-left">
                                <thead className="bg-weseco-800 text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Nombre Clave</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-weseco-800 text-sm">
                                    {tiposContenido.map((tipo) => (
                                        <tr key={tipo.id} className="hover:bg-weseco-900/50">
                                            <td className="px-4 py-3 font-mono text-gray-500">#{tipo.id}</td>
                                            <td className="px-4 py-3 font-bold text-white">{tipo.nombre}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                                                    Activo
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {tiposContenido.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                                                Cargando tipos...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Panel Informativo Estático */}
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-wider text-weseco-400 font-semibold mb-4">
                            Estado del Servidor
                        </h3>
                        <div className="bg-weseco-950 p-4 rounded-lg border border-weseco-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={20} className="text-green-500" />
                                <span>API Spring Boot</span>
                            </div>
                            <span className="text-green-400 text-sm font-mono">ONLINE</span>
                        </div>
                        <div className="bg-weseco-950 p-4 rounded-lg border border-weseco-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span>Base de Datos</span>
                            </div>
                            <span className="text-blue-400 text-sm font-mono">CONECTADO</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente pequeño para las tarjetas de arriba
const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg border ${color} flex items-center justify-between transition hover:scale-105 cursor-default`}>
        <div>
            <p className="text-weseco-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className="p-3 bg-weseco-950 rounded-full border border-weseco-800">
            {icon}
        </div>
    </div>
);