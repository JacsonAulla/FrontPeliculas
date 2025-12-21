import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPeliculas = () => {
    const [peliculas, setPeliculas] = useState([]);
    const navigate = useNavigate();

    const fetchPeliculas = async () => {
        try {
            const res = await api.get('/api/peliculas/admin');
            setPeliculas(res.data);
        } catch (error) {
            console.error("Error al cargar tabla", error);
        }
    };

    useEffect(() => {
        fetchPeliculas();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return;
        try {
            await api.delete(`/api/peliculas/${id}`);
            fetchPeliculas(); // Recargar tabla
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const toggleEstado = async (id) => {
        try {
            await api.patch(`/api/peliculas/${id}/estado`);
            fetchPeliculas();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Películas</h1>
                <button
                    onClick={() => navigate('/admin/peliculas/nuevo')}
                    className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-medium hover:bg-gray-200 transition"
                >
                    <Plus size={20} /> Nueva Película
                </button>
            </div>

            {/* Tabla Minimalista */}
            <div className="bg-weseco-900 rounded-lg overflow-hidden border border-weseco-800">
                <table className="w-full text-left">
                    <thead className="bg-weseco-800 text-weseco-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Póster</th>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">Géneros</th>
                            <th className="px-6 py-4">Duración</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-weseco-800">
                        {peliculas.map((peli) => (
                            <tr key={peli.id} className="hover:bg-weseco-800/50 transition">
                                <td className="px-6 py-4 text-weseco-400">#{peli.id}</td>
                                <td className="px-6 py-4">
                                    <img src={peli.imgPoster} alt="poster" className="w-10 h-14 object-cover rounded bg-black" />
                                </td>
                                <td className="px-6 py-4 font-medium">{peli.titulo}</td>
                                <td className="px-6 py-4 text-sm text-weseco-400">
                                    {peli.generosNombres.join(', ')}
                                </td>
                                <td className="px-6 py-4 text-sm">{peli.duracionMinutos} min</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleEstado(peli.id)}>
                                        {peli.estaActivo
                                            ? <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit"><Eye size={12} /> Activo</span>
                                            : <span className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit"><EyeOff size={12} /> Oculto</span>
                                        }
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button
                                        onClick={() => navigate(`/admin/peliculas/editar/${peli.id}`)}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(peli.id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {peliculas.length === 0 && (
                    <div className="p-10 text-center text-weseco-400">No hay películas registradas.</div>
                )}
            </div>
        </div>
    );
};