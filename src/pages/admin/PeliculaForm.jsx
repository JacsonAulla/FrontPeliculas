import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

export const PeliculaForm = () => {
    const { id } = useParams(); // Si hay ID, es edición. Si no, es crear.
    const navigate = useNavigate();
    const isEdit = !!id;

    // Estado del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        anioLanzamiento: new Date().getFullYear(),
        imgPoster: '',
        imgBanner: '',
        duracionMinutos: 0,
        urlStream: '',
        formatoStream: 'HLS',
        generoIds: [] // Array de IDs
    });

    const [generosDisponibles, setGenerosDisponibles] = useState([]);

    // Cargar géneros y datos de la peli (si es edición)
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Cargar lista de Géneros para el Select
                const resGen = await api.get('/api/generos');
                setGenerosDisponibles(resGen.data);

                // 2. Si estamos EDITANDO (hay ID), cargamos los datos FULL de la película
                if (isEdit) {
                    // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
                    // Llamamos al nuevo endpoint que acabamos de crear en Spring Boot
                    const resPeli = await api.get(`/api/peliculas/admin/${id}`);

                    // Rellenamos el formulario con los datos que vinieron
                    setFormData(resPeli.data);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
                alert("Error al cargar la información. Revisa la consola.");
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejo especial para multiselect de géneros
    const handleGeneroChange = (e) => {
        const options = e.target.options;
        const selectedIds = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedIds.push(parseInt(options[i].value));
            }
        }
        setFormData(prev => ({ ...prev, generoIds: selectedIds }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/api/peliculas/${id}`, formData);
            } else {
                await api.post('/api/peliculas', formData);
            }
            navigate('/admin/peliculas');
        } catch (error) {
            alert("Error al guardar: " + (error.response?.data?.message || "Revisa los datos"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Editar Película' : 'Nueva Película'}</h1>

            <form onSubmit={handleSubmit} className="bg-weseco-900 p-8 rounded border border-weseco-800 space-y-6">

                {/* Título */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Título</label>
                    <input name="titulo" value={formData.titulo} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" required />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" />
                </div>

                {/* Grid 2 Columnas */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-weseco-400 mb-1">Año</label>
                        <input type="number" name="anioLanzamiento" value={formData.anioLanzamiento} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="block text-sm text-weseco-400 mb-1">Duración (min)</label>
                        <input type="number" name="duracionMinutos" value={formData.duracionMinutos} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" />
                    </div>
                </div>

                {/* Imágenes */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-weseco-400 mb-1">URL Póster (Vertical)</label>
                        <input name="imgPoster" value={formData.imgPoster} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm text-weseco-400 mb-1">URL Banner (Horizontal)</label>
                        <input name="imgBanner" value={formData.imgBanner} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" placeholder="https://..." />
                    </div>
                </div>

                {/* Video Stream */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">URL del Video (m3u8 / mp4)</label>
                    <input name="urlStream" value={formData.urlStream} onChange={handleChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white" placeholder="https://servidor.com/video.m3u8" required />
                </div>

                {/* Géneros (Multiselect simple) */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Géneros (Ctrl + Click para varios)</label>
                    <select multiple value={formData.generoIds} onChange={handleGeneroChange} className="w-full bg-weseco-950 border border-weseco-800 p-2 rounded text-white h-32">
                        {generosDisponibles.map(g => (
                            <option key={g.id} value={g.id}>{g.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/peliculas')} className="text-weseco-400 hover:text-white">Cancelar</button>
                    <button type="submit" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">Guardar</button>
                </div>
            </form>
        </div>
    );
};