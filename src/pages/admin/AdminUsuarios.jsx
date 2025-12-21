import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, UserPlus } from 'lucide-react';

export const AdminUsuarios = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Users /> Gestión de Usuarios
                </h1>
                <button
                    onClick={() => navigate('/admin/usuarios/nuevo')}
                    className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 font-bold hover:bg-gray-200 transition"
                >
                    <Plus size={20} /> Nuevo Usuario
                </button>
            </div>

            {/* Placeholder de la Tabla (La implementaremos luego cuando tengas el endpoint GET) */}
            <div className="bg-weseco-900 rounded-lg border border-weseco-800 p-10 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-weseco-800 p-4 rounded-full">
                        <UserPlus size={48} className="text-weseco-400" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lista de Usuarios</h3>
                <p className="text-weseco-400 max-w-md mx-auto">
                    Aquí podrás ver y administrar a todos los usuarios registrados.
                    <br />
                    <span className="text-sm opacity-60">(Funcionalidad de listado pendiente de endpoint backend)</span>
                </p>
                <button
                    onClick={() => navigate('/admin/usuarios/nuevo')}
                    className="mt-6 text-blue-400 hover:text-white underline"
                >
                    Registrar un usuario ahora
                </button>
            </div>
        </div>
    );
};