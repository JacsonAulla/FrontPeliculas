import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Plus, Trash2, ArrowLeft, MonitorPlay, Film } from 'lucide-react';

export const AdminSerieDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado para el Modal de Episodio
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ temporadaId: null, numeroEpisodio: 1, titulo: '', urlStream: '', duracionMinutos: 0, descripcion: '', imgMiniatura: '' });

    const fetchSerieCompleta = async () => {
        try {
            const res = await api.get(`/api/admin-series/${id}/full`);
            setSerie(res.data);
        } catch (error) {
            console.error("Error cargando serie", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSerieCompleta(); }, [id]);

    // --- ACCIONES ---

    const handleAddTemporada = async () => {
        // Calcula el número de la siguiente temporada
        const nextNum = (serie.temporadas?.length || 0) + 1;
        if (!window.confirm(`¿Crear Temporada ${nextNum}?`)) return;

        try {
            await api.post('/api/admin-series/temporadas', {
                serieId: id,
                numeroTemporada: nextNum,
                titulo: `Temporada ${nextNum}`,
                fechaEstreno: new Date().toISOString().split('T')[0]
            });
            fetchSerieCompleta(); // Recargar árbol
        } catch (e) { alert("Error al crear temporada"); }
    };

    const handleDeleteTemporada = async (tempId) => {
        if (!window.confirm("Se borrarán todos sus episodios. ¿Seguro?")) return;
        try {
            await api.delete(`/api/admin-series/temporadas/${tempId}`);
            fetchSerieCompleta();
        } catch (e) { alert("Error al eliminar temporada"); }
    };

    const openModalEpisodio = (temporadaId, totalEpisodiosActuales) => {
        setModalData({
            temporadaId: temporadaId,
            numeroEpisodio: totalEpisodiosActuales + 1,
            titulo: '',
            urlStream: '',
            duracionMinutos: 24,
            descripcion: '',
            imgMiniatura: ''
        });
        setShowModal(true);
    };

    const handleSaveEpisodio = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin-series/episodios', modalData);
            setShowModal(false);
            fetchSerieCompleta();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Revisa los datos"));
        }
    };

    const handleDeleteEpisodio = async (epiId) => {
        if (!window.confirm("¿Borrar episodio?")) return;
        try {
            await api.delete(`/api/admin-series/episodios/${epiId}`);
            fetchSerieCompleta();
        } catch (e) { alert("Error al eliminar"); }
    };

    if (loading) return <div className="p-10 text-white">Cargando estructura...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/series')} className="p-2 bg-weseco-800 rounded hover:bg-white hover:text-black">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <img src={serie.imgPoster} className="w-12 h-18 object-cover rounded" />
                    <h1 className="text-3xl font-bold">{serie.titulo}</h1>
                </div>
            </div>

            {/* Botón Agregar Temporada */}
            <button onClick={handleAddTemporada} className="mb-8 w-full py-4 border-2 border-dashed border-weseco-800 rounded-lg text-weseco-400 hover:text-white hover:border-white transition flex items-center justify-center gap-2">
                <Plus size={24} /> Agregar Nueva Temporada
            </button>

            {/* Lista de Temporadas (Acordeón visual) */}
            <div className="space-y-6">
                {serie.temporadas && serie.temporadas.map((temp) => (
                    <div key={temp.id} className="bg-weseco-900 rounded-lg border border-weseco-800 overflow-hidden">

                        {/* Cabecera de Temporada */}
                        <div className="bg-weseco-800/50 p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Temporada {temp.numeroTemporada}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModalEpisodio(temp.id, temp.episodios.length)}
                                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                >
                                    <Plus size={14} /> Agregar Episodio
                                </button>
                                <button onClick={() => handleDeleteTemporada(temp.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Lista de Episodios */}
                        <div className="p-4 space-y-2">
                            {temp.episodios.length === 0 && <p className="text-sm text-gray-500 italic">No hay episodios.</p>}

                            {temp.episodios.map((epi) => (
                                <div key={epi.id} className="flex items-center justify-between bg-weseco-950 p-3 rounded hover:bg-black transition group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 font-mono w-6">{epi.numeroEpisodio}</span>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{epi.titulo}</span>
                                            <span className="text-xs text-gray-500">{epi.duracionMinutos} min</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Podrías poner un botón de editar episodio aquí */}
                                        <button onClick={() => handleDeleteEpisodio(epi.id)} className="text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL PARA NUEVO EPISODIO */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-weseco-900 p-6 rounded-lg w-full max-w-lg border border-weseco-700">
                        <h2 className="text-xl font-bold mb-4">Nuevo Episodio</h2>
                        <form onSubmit={handleSaveEpisodio} className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <label className="text-xs text-gray-400">Nº</label>
                                    <input type="number" required value={modalData.numeroEpisodio} onChange={e => setModalData({ ...modalData, numeroEpisodio: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" />
                                </div>
                                <div className="col-span-3">
                                    <label className="text-xs text-gray-400">Título</label>
                                    <input required value={modalData.titulo} onChange={e => setModalData({ ...modalData, titulo: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400">URL Stream (m3u8/mp4)</label>
                                <input required value={modalData.urlStream} onChange={e => setModalData({ ...modalData, urlStream: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Duración (min)</label>
                                    <input type="number" value={modalData.duracionMinutos} onChange={e => setModalData({ ...modalData, duracionMinutos: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Miniatura URL</label>
                                    <input value={modalData.imgMiniatura} onChange={e => setModalData({ ...modalData, imgMiniatura: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400">Descripción</label>
                                <textarea value={modalData.descripcion} onChange={e => setModalData({ ...modalData, descripcion: e.target.value })} className="w-full bg-weseco-950 border border-weseco-700 rounded p-2 text-white" rows="2" />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};