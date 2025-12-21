/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                weseco: {
                    // Fondo principal (Casi negro, pero suave)
                    950: '#09090b',

                    // Superficies (Tarjetas, Barras laterales)
                    900: '#18181b',

                    // Bordes sutiles / Elementos secundarios
                    800: '#27272a',

                    // Texto secundario (Gris suave)
                    400: '#a1a1aa',

                    // Acento (Blanco puro para botones importantes)
                    100: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}