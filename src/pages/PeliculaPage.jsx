import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { VideoPlayer } from '../components/VideoPlayer';
import { Navbar } from '../components/Navbar';
import { Play, X } from 'lucide-react';

export const PeliculaPage = () => {
    const { slug } = useParams(); // Leemos la URL
    const [pelicula, setPelicula] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null); // Si tiene valor, mostramos el player
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const res = await api.get(`/api/peliculas/${slug}`);
                setPelicula(res.data);
            } catch (error) {
                console.error("Error cargando película", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [slug]);

    const handlePlay = async () => {
        try {
            // Pedimos el link del video al backend (solo al dar play)
            const res = await api.get(`/api/peliculas/${slug}/play`);
            setVideoUrl(res.data.urlStream);
        } catch (error) {
            alert("Error al obtener el video");
        }
    };

    if (loading) return <div className="text-white p-10">Cargando...</div>;
    if (!pelicula) return <div className="text-white p-10">No encontrada</div>;

    return (
        <div className="min-h-screen bg-weseco-950">
            {/* Si estamos viendo video, ocultamos el resto o usamos un modal full screen */}
            {videoUrl ? (
                <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center">
                    <button
                        onClick={() => setVideoUrl(null)} // Cerrar video
                        className="absolute top-4 right-4 z-50 text-white bg-weseco-900/50 p-2 rounded-full hover:bg-red-600 transition"
                    >
                        <X size={24} />
                    </button>
                    <div className="h-screen w-full">
                        <VideoPlayer
                            src={videoUrl}
                            options={{ autoplay: true, controls: true, fluid: true }}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />
                    {/* Banner de Fondo */}
                    <div className="relative h-[70vh] w-full">
                        <img
                            src={pelicula.imgBanner || pelicula.imgPoster}
                            alt={pelicula.titulo}
                            className="w-full h-full object-cover mask-gradient"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-weseco-950 via-weseco-950/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">{pelicula.titulo}</h1>

                            <div className="flex gap-4 text-sm text-gray-300 mb-6">
                                <span>{pelicula.anioLanzamiento}</span>
                                <span>{pelicula.duracionMinutos} min</span>
                                <span className="border border-gray-500 px-2 rounded text-xs flex items-center">HD</span>
                            </div>

                            <p className="max-w-2xl text-lg text-gray-200 mb-8 line-clamp-3">
                                {pelicula.descripcion}
                            </p>

                            <button
                                onClick={handlePlay}
                                className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition"
                            >
                                <Play fill="currentColor" /> Reproducir
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};