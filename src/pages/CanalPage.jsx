import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { VideoPlayer } from '../components/VideoPlayer';
import { Navbar } from '../components/Navbar';

export const CanalPage = () => {
    const { slug } = useParams();
    const [canal, setCanal] = useState(null);

    useEffect(() => {
        api.get(`/api/canales/${slug}`).then(res => setCanal(res.data));
    }, [slug]);

    if (!canal) return <div className="text-white p-10">Cargando TV...</div>;

    return (
        <div className="min-h-screen bg-weseco-950 flex flex-col">
            <Navbar />

            {/* Contenedor del Player (Estilo Cine) */}
            <div className="flex-1 flex flex-col pt-16">
                <div className="w-full h-[60vh] md:h-[80vh] bg-black relative">
                    {/* Player directo con el link del canal */}
                    <VideoPlayer
                        src={canal.urlStream}
                        options={{ autoplay: true, controls: true, fluid: false, fill: true }}
                    />
                </div>

                {/* Info del Canal debajo */}
                <div className="p-6 bg-weseco-900 flex-1">
                    <div className="flex items-center gap-4">
                        <img src={canal.imgPoster} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <h1 className="text-2xl font-bold">{canal.titulo}</h1>
                            <p className="text-weseco-400">{canal.pais} • En Vivo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};