import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

export const CanalForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        titulo: '', descripcion: '', imgPoster: '', imgBanner: '',
        urlStream: '', pais: '', tipoTransmision: 'HLS', generoIds: []
    });
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        const load = async () => {
            const resG = await api.get('/api/generos');
            setGeneros(resG.data);
            if (isEdit) {
                const resC = await api.get(`/api/canales/admin/${id}`);
                setFormData(resC.data);
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Nota: Si no tienes PUT en el backend, el editar fallará al guardar.
            if (isEdit) alert("Falta implementar PUT en CanalController");
            else await api.post('/api/canales', formData);

            navigate('/admin/canales');
        } catch (e) { alert("Error al guardar"); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGeneroChange = (e) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, generoIds: selectedIds });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Editar Canal' : 'Nuevo Canal'}</h1>
            <form onSubmit={handleSubmit} className="bg-weseco-900 p-8 rounded border border-weseco-800 space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-weseco-400 mb-1">Nombre del Canal</label>
                        <input name="titulo" value={formData.titulo} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" required />
                    </div>
                    <div>
                        <label className="block text-weseco-400 mb-1">País</label>
                        <input name="pais" value={formData.pais} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" placeholder="Ej: Perú" />
                    </div>
                </div>

                <div>
                    <label className="block text-weseco-400 mb-1">URL Stream (m3u8)</label>
                    <input name="urlStream" value={formData.urlStream} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" required placeholder="https://..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-weseco-400 mb-1">Logo URL (Poster)</label>
                        <input name="imgPoster" value={formData.imgPoster} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" />
                    </div>
                    <div>
                        <label className="block text-weseco-400 mb-1">Banner URL</label>
                        <input name="imgBanner" value={formData.imgBanner} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" />
                    </div>
                </div>

                <div>
                    <label className="block text-weseco-400 mb-1">Géneros</label>
                    <select multiple value={formData.generoIds} onChange={handleGeneroChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800 h-32">
                        {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/canales')} className="text-weseco-400">Cancelar</button>
                    <button type="submit" className="bg-white text-black px-6 py-2 rounded font-bold">Guardar</button>
                </div>
            </form>
        </div>
    );
};