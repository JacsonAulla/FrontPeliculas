import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { User, Lock, Shield, Image as ImageIcon } from 'lucide-react';

export const UsuarioForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        imagenUrl: '',
        rolNombre: 'ROLE_USUARIO' // Valor por defecto
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Llamamos a tu endpoint de registro
            await api.post('/auth/register', formData);
            alert('Usuario creado exitosamente');
            navigate('/admin/usuarios');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear el usuario. El nombre podría estar en uso.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Registrar Nuevo Usuario</h1>

            <form onSubmit={handleSubmit} className="bg-weseco-900 p-8 rounded-lg border border-weseco-800 space-y-6">

                {/* Usuario */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Nombre de Usuario</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-weseco-400" />
                        </div>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-weseco-950 border border-weseco-800 text-white rounded pl-10 p-2.5 focus:border-white outline-none"
                            placeholder="Ej: nuevoAdmin"
                            required
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-weseco-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-weseco-950 border border-weseco-800 text-white rounded pl-10 p-2.5 focus:border-white outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {/* Rol */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">Rol / Permisos</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield size={18} className="text-weseco-400" />
                        </div>
                        <select
                            name="rolNombre"
                            value={formData.rolNombre}
                            onChange={handleChange}
                            className="w-full bg-weseco-950 border border-weseco-800 text-white rounded pl-10 p-2.5 focus:border-white outline-none appearance-none"
                        >
                            <option value="ROLE_USUARIO">Usuario Normal (Ver contenido)</option>
                            <option value="ROLE_ADMIN">Administrador (Gestión total)</option>
                        </select>
                    </div>
                </div>

                {/* Avatar URL */}
                <div>
                    <label className="block text-sm text-weseco-400 mb-1">URL Avatar (Opcional)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ImageIcon size={18} className="text-weseco-400" />
                        </div>
                        <input
                            name="imagenUrl"
                            value={formData.imagenUrl}
                            onChange={handleChange}
                            className="w-full bg-weseco-950 border border-weseco-800 text-white rounded pl-10 p-2.5 focus:border-white outline-none"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                        {error}
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/usuarios')}
                        className="text-weseco-400 hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition"
                    >
                        Registrar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};