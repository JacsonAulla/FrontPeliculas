import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Edit, Trash2, Plus, X, Tag } from 'lucide-react';

export const AdminGeneros = () => {
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado del Modal
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nombre, setNombre] = useState('');

    // 1. Cargar Géneros
    const fetchGeneros = async () => {
        try {
            const res = await api.get('/api/generos');
            setGeneros(res.data);
        } catch (error) {
            console.error("Error al cargar géneros", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGeneros(); }, []);

    // 2. Manejar Guardado (Crear o Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Editar
                await api.put(`/api/generos/${editingId}`, { nombre });
            } else {
                // Crear
                await api.post('/api/generos', { nombre });
            }
            // Limpiar y recargar
            closeModal();
            fetchGeneros();
        } catch (error) {
            alert(error.response?.data?.message || "Error al guardar el género");
        }
    };

    // 3. Eliminar
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este género?")) return;
        try {
            await api.delete(`/api/generos/${id}`);
            fetchGeneros();
        } catch (error) {
            alert("No se puede eliminar (probablemente esté en uso en alguna película o serie).");
        }
    };

    // Auxiliares del Modal
    const openModal = (genero = null) => {
        if (genero) {
            setEditingId(genero.id);
            setNombre(genero.nombre);
        } else {
            setEditingId(null);
            setNombre('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setNombre('');
    };

    if (loading) return <div className="p-8 text-white">Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Tag /> Géneros
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-bold hover:bg-gray-200 transition"
                >
                    <Plus size={20} /> Nuevo Género
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-weseco-900 rounded-lg border border-weseco-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-weseco-800 text-weseco-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-weseco-800">
                        {generos.map((g) => (
                            <tr key={g.id} className="hover:bg-weseco-800/50 transition">
                                <td className="px-6 py-4 text-weseco-400 font-mono">#{g.id}</td>
                                <td className="px-6 py-4 font-medium text-lg">{g.nombre}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button
                                        onClick={() => openModal(g)}
                                        className="text-blue-400 hover:text-blue-300"
                                        aria-label="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(g.id)}
                                        className="text-red-500 hover:text-red-400"
                                        aria-label="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {generos.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center p-8 text-weseco-400">
                                    No hay géneros registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL (Ventana Flotante) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-weseco-900 border border-weseco-700 p-6 rounded-lg w-full max-w-sm shadow-2xl relative">

                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-weseco-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Editar Género' : 'Nuevo Género'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm text-weseco-400 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full bg-weseco-950 border border-weseco-700 rounded p-3 text-white focus:border-white outline-none transition"
                                    placeholder="Ej: Ciencia Ficción"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-weseco-400 hover:text-white transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};