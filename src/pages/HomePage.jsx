import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Navbar } from '../components/Navbar';
import { MediaCard } from '../components/MediaCard';

export const HomePage = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [series, setSeries] = useState([]);
    const [canales, setCanales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hacemos las 3 peticiones en paralelo para que cargue rápido
                const [resPelis, resSeries, resCanales] = await Promise.all([
                    api.get('/api/peliculas/home'),
                    api.get('/api/series/home'),
                    api.get('/api/canales/home')
                ]);

                setPeliculas(resPelis.data);
                setSeries(resSeries.data);
                setCanales(resCanales.data);
            } catch (error) {
                console.error("Error cargando catálogo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-weseco-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-weseco-950 pb-20">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">

                {/* Sección CANALES (Si hay) */}
                {canales.length > 0 && (
                    <Section title="TV en Vivo" items={canales} type="canales" />
                )}

                {/* Sección PELÍCULAS */}
                {peliculas.length > 0 && (
                    <Section title="Películas Recientes" items={peliculas} type="peliculas" />
                )}

                {/* Sección SERIES */}
                {series.length > 0 && (
                    <Section title="Series Populares" items={series} type="series" />
                )}

                {/* Mensaje si está todo vacío */}
                {peliculas.length === 0 && series.length === 0 && canales.length === 0 && (
                    <div className="text-center py-20 text-weseco-400">
                        <p>No hay contenido disponible aún.</p>
                        <p className="text-sm">Entra como Admin para agregar contenido.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente auxiliar para no repetir código de secciones
const Section = ({ title, items, type }) => (
    <div>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-white pl-3">
            {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
                <MediaCard key={item.id} data={item} type={type} />
            ))}
        </div>
    </div>
);