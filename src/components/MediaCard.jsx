import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

// type: 'peliculas' | 'series' | 'canales'
export const MediaCard = ({ data, type }) => {
    const navigate = useNavigate();

    // Función para manejar el clic
    const handleClick = () => {
        // Navegaremos a /peliculas/matrix o /series/breaking-bad
        // Usamos el slug si existe, o el id como respaldo
        const identifier = data.slug || data.id;
        navigate(`/${type}/${identifier}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative bg-weseco-900 rounded-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/50 aspect-[2/3]"
        >
            {/* Imagen del Poster */}
            <img
                src={data.imgPoster || "https://via.placeholder.com/300x450?text=No+Image"}
                alt={data.titulo}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />

            {/* Overlay al pasar el mouse (Efecto Hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-sm drop-shadow-md">
                    {data.titulo}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                    <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200">
                        <Play size={12} fill="currentColor" />
                    </button>
                    <span className="text-xs text-gray-300">Ver ahora</span>
                </div>
            </div>
        </div>
    );
};