import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Edit, Trash2, Plus, Tv, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminCanales = () => {
    const [canales, setCanales] = useState([]);
    const navigate = useNavigate();

    const fetchCanales = async () => {
        try {
            const res = await api.get('/api/canales/admin');
            setCanales(res.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchCanales(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar canal?")) return;
        try { await api.delete(`/api/canales/${id}`); fetchCanales(); } catch (e) { alert("Error"); }
    };

    const toggleEstado = async (id) => {
        try {
            await api.patch(`/api/canales/${id}/estado`);
            fetchCanales();
        } catch (error) {
            console.error("Error al cambiar estado", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Canales en Vivo</h1>
                <button onClick={() => navigate('/admin/canales/nuevo')} className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-medium hover:bg-gray-200">
                    <Plus size={20} /> Nuevo Canal
                </button>
            </div>

            <div className="bg-weseco-900 rounded-lg overflow-hidden border border-weseco-800">
                <table className="w-full text-left">
                    <thead className="bg-weseco-800 text-weseco-400 uppercase text-xs">
                        {/* He limpiado los comentarios entre etiquetas aquí */}
                        <tr>
                            <th className="px-6 py-4">Canal</th>
                            <th className="px-6 py-4">País</th>
                            <th className="px-6 py-4">Géneros</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-weseco-800">
                        {canales.map((c) => (
                            <tr key={c.id} className="hover:bg-weseco-800/50">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="bg-black p-1 rounded">
                                        <Tv size={20} className="text-weseco-400" />
                                    </div>
                                    {c.titulo}
                                </td>
                                <td className="px-6 py-4 text-sm">{c.pais}</td>
                                <td className="px-6 py-4 text-sm text-weseco-400">{c.generosNombres?.join(', ')}</td>

                                {/* Columna Estado Limpia */}
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleEstado(c.id)}>
                                        {/* Lógica visual: Si c.estaActivo es true/false (o null) */}
                                        {c.estaActivo ? (
                                            <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit">
                                                <Eye size={12} /> Activo
                                            </span>
                                        ) : (
                                            <span className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit">
                                                <EyeOff size={12} /> Oculto
                                            </span>
                                        )}
                                    </button>
                                </td>

                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => navigate(`/admin/canales/editar/${c.id}`)} className="text-blue-400 hover:text-blue-300">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};