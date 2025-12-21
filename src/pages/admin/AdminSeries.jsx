import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Edit, Trash2, Plus, Eye, EyeOff, Layers } from 'lucide-react'; // Icono Layers para temporadas
import { useNavigate } from 'react-router-dom';

export const AdminSeries = () => {
    const [series, setSeries] = useState([]);
    const navigate = useNavigate();

    const fetchSeries = async () => {
        try {
            const res = await api.get('/api/series/admin');
            setSeries(res.data);
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => { fetchSeries(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Se borrarán también las temporadas y episodios. ¿Seguro?")) return;
        try {
            await api.delete(`/api/series/${id}`);
            fetchSeries();
        } catch (error) { alert("Error al eliminar"); }
    };

    const toggleEstado = async (id) => {
        try { await api.patch(`/api/series/${id}/estado`); fetchSeries(); } catch (e) { }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Series</h1>
                <button onClick={() => navigate('/admin/series/nuevo')} className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-medium hover:bg-gray-200">
                    <Plus size={20} /> Nueva Serie
                </button>
            </div>

            <div className="bg-weseco-900 rounded-lg overflow-hidden border border-weseco-800">
                <table className="w-full text-left">
                    <thead className="bg-weseco-800 text-weseco-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Póster</th>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Temporadas</th>
                            <th className="px-6 py-4">Activo</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-weseco-800">
                        {series.map((s) => (
                            <tr key={s.id} className="hover:bg-weseco-800/50">
                                <td className="px-6 py-4 text-weseco-400">#{s.id}</td>
                                <td className="px-6 py-4">
                                    <img src={s.imgPoster} className="w-10 h-14 object-cover rounded bg-black" />
                                </td>
                                <td className="px-6 py-4 font-medium">{s.titulo}</td>
                                <td className="px-6 py-4 text-sm text-weseco-400">{s.estadoSerie}</td>
                                <td className="px-6 py-4 text-sm">{s.totalTemporadas}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleEstado(s.id)}>
                                        {s.estaActivo
                                            ? <span className="text-green-400 flex items-center gap-1"><Eye size={16} /></span>
                                            : <span className="text-red-400 flex items-center gap-1"><EyeOff size={16} /></span>
                                        }
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    {/* Botón Gestión de Episodios (NUEVO) */}
                                    <button
                                        onClick={() => navigate(`/admin/series/${s.id}/contenido`)}
                                        className="text-yellow-500 hover:text-yellow-400"
                                        title="Gestionar Temporadas"
                                    >
                                        <Layers size={18} />
                                    </button>

                                    <button onClick={() => navigate(`/admin/series/editar/${s.id}`)} className="text-blue-400 hover:text-blue-300">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-400">
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