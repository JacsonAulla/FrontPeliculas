import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { VideoPlayer } from '../components/VideoPlayer';
import { Navbar } from '../components/Navbar';
import { PlayCircle, X } from 'lucide-react';

export const SeriePage = () => {
    const { slug } = useParams();
    const [serie, setSerie] = useState(null);
    const [playerData, setPlayerData] = useState(null); // { url: '...', titulo: '...' }

    useEffect(() => {
        api.get(`/api/series/${slug}`).then(res => setSerie(res.data));
    }, [slug]);

    const handlePlayEpisodio = async (episodioId) => {
        try {
            // Buscamos el link del episodio específico
            const res = await api.get(`/api/episodios/${episodioId}/play`);
            setPlayerData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!serie) return <div className="p-10 text-white">Cargando serie...</div>;

    return (
        <div className="min-h-screen bg-weseco-950 pb-20">

            {/* Modal Player */}
            {playerData && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    <div className="flex justify-between items-center p-4 bg-weseco-900">
                        <span className="font-bold">{playerData.tituloEpisodio}</span>
                        <button onClick={() => setPlayerData(null)}><X /></button>
                    </div>
                    <div className="flex-1 bg-black">
                        <VideoPlayer
                            src={playerData.urlStream}
                            options={{ autoplay: true, controls: true, fluid: true }}
                        />
                    </div>
                </div>
            )}

            <Navbar />

            {/* Banner Serie */}
            <div className="relative h-[50vh]">
                <img src={serie.imgBanner} className="w-full h-full object-cover opacity-60" />
                <div className="absolute bottom-0 p-8 w-full bg-gradient-to-t from-weseco-950 to-transparent">
                    <h1 className="text-5xl font-bold mb-2">{serie.titulo}</h1>
                    <p className="max-w-xl text-gray-300">{serie.descripcion}</p>
                </div>
            </div>

            {/* Lista de Temporadas y Episodios */}
            <div className="max-w-5xl mx-auto px-4 mt-10">
                {serie.temporadas && serie.temporadas.map((temp) => (
                    <div key={temp.id} className="mb-8">
                        <h3 className="text-xl font-semibold text-weseco-400 mb-4 border-b border-weseco-800 pb-2">
                            Temporada {temp.numeroTemporada}
                            {temp.titulo && <span className="ml-2 text-sm text-gray-500">- {temp.titulo}</span>}
                        </h3>

                        <div className="grid gap-2">
                            {temp.episodios.map((epi) => (
                                <div
                                    key={epi.id}
                                    onClick={() => handlePlayEpisodio(epi.id)}
                                    className="flex items-center gap-4 p-4 bg-weseco-900 hover:bg-weseco-800 rounded cursor-pointer transition"
                                >
                                    <span className="text-gray-500 w-6 font-mono text-lg">{epi.numeroEpisodio}</span>

                                    {/* Miniatura (si hay) o Placeholder */}
                                    <div className="w-32 h-20 bg-black rounded overflow-hidden relative flex-shrink-0">
                                        {epi.imgMiniatura ? (
                                            <img src={epi.imgMiniatura} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-weseco-800">
                                                <PlayCircle size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold">{epi.titulo}</h4>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{epi.descripcion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};