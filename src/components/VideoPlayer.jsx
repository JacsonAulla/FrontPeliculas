import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = ({ src, options, onDispose }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // Validación básica: Si no hay videoRef, no hacemos nada
        if (!videoRef.current) return;

        // 1. Inicializar el reproductor si no existe
        if (!playerRef.current) {
            // Crear el elemento video dinámicamente para evitar conflictos con React
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');

            // IMPORTANTE: Esto ayuda con servidores externos que requieren CORS
            //videoElement.setAttribute('crossOrigin', 'anonymous');

            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                ...options,
                // Configuración predeterminada recomendada
                fluid: true, // Se adapta al contenedor
                controls: true,
                preload: 'auto',
                html5: {
                    vhs: {
                        overrideNative: true // Mejora soporte HLS en Chrome/Edge
                    },
                    nativeAudioTracks: false,
                    nativeVideoTracks: false
                },
                sources: [{
                    src: src,
                    type: detectMimeType(src)
                }]
            }, () => {
                videojs.log('Reproductor inicializado');
            });

            // Manejo de errores visuales
            player.on('error', () => {
                console.warn("VideoJS Error:", player.error());
            });

        } else {
            // 2. Si ya existe, solo actualizamos la fuente (src)
            const player = playerRef.current;
            player.src({
                src: src,
                type: detectMimeType(src)
            });
        }
    }, [src, options]);

    // Limpieza al desmontar el componente
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
                if (onDispose) onDispose();
            }
        };
    }, []);

    return (
        <div data-vjs-player style={{ width: '100%', height: '100%' }}>
            <div ref={videoRef} className="w-full h-full" />
        </div>
    );
};

// Función auxiliar para detectar tipo de video
const detectMimeType = (url) => {
    if (!url) return 'video/mp4'; // Fallback por defecto
    if (url.includes('.m3u8')) return 'application/x-mpegURL'; // HLS
    if (url.includes('.mpd')) return 'application/dash+xml'; // DASH
    return 'video/mp4'; // MP4, MKV, WebM suelen funcionar con este o el navegador lo infiere
};