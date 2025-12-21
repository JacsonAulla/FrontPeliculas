import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

export const SerieForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        titulo: '', descripcion: '', anioLanzamiento: new Date().getFullYear(),
        imgPoster: '', imgBanner: '', estadoSerie: 'FINALIZADA', generoIds: []
    });
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        const load = async () => {
            const resG = await api.get('/api/generos');
            setGeneros(resG.data);
            if (isEdit) {
                const resS = await api.get(`/api/series/admin/${id}`);
                setFormData(resS.data);
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await api.put(`/api/series/${id}`, formData);
            else await api.post('/api/series', formData);
            navigate('/admin/series');
        } catch (e) { alert("Error al guardar"); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGeneroChange = (e) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, generoIds: selectedIds });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Editar Serie' : 'Nueva Serie'}</h1>
            <form onSubmit={handleSubmit} className="bg-weseco-900 p-8 rounded border border-weseco-800 space-y-6">

                <div>
                    <label className="block text-weseco-400 mb-1">Título</label>
                    <input name="titulo" value={formData.titulo} onChange={handleChange} className="input-dark w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" required />
                </div>

                <div>
                    <label className="block text-weseco-400 mb-1">Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" rows="3" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-weseco-400 mb-1">Año</label>
                        <input type="number" name="anioLanzamiento" value={formData.anioLanzamiento} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800" />
                    </div>
                    <div>
                        <label className="block text-weseco-400 mb-1">Estado</label>
                        <select name="estadoSerie" value={formData.estadoSerie} onChange={handleChange} className="w-full bg-weseco-950 p-2 rounded text-white border border-weseco-800">
                            <option value="FINALIZADA">Finalizada</option>
                            <option value="EN EMISION">En Emisión</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-weseco-400 mb-1">Póster URL</label>
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
                    <button type="button" onClick={() => navigate('/admin/series')} className="text-weseco-400">Cancelar</button>
                    <button type="submit" className="bg-white text-black px-6 py-2 rounded font-bold">Guardar</button>
                </div>
            </form>
        </div>
    );
};