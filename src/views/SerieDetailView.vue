<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SerieService from '../services/SerieService';

const route = useRoute();
const router = useRouter();

const serie = ref(null);
const loading = ref(true);
const activeSeasonIndex = ref(0); // Índice de la temporada seleccionada (0 = Temporada 1)

onMounted(async () => {
  const serieId = route.params.id;
  try {
    // Traemos la serie completa con todo el árbol (Temporadas -> Episodios)
    serie.value = await SerieService.getById(serieId);
    
    // Ordenar temporadas por número (por si acaso vienen desordenadas)
    if (serie.value.temporadas) {
        serie.value.temporadas.sort((a, b) => a.numeroTemporada - b.numeroTemporada);
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la serie");
    router.push('/home');
  } finally {
    loading.value = false;
  }
});

// Propiedad computada para obtener los episodios de la temporada actual
const currentEpisodes = computed(() => {
    if (!serie.value || !serie.value.temporadas || serie.value.temporadas.length === 0) return [];
    
    const season = serie.value.temporadas[activeSeasonIndex.value];
    // Ordenar episodios
    return season.episodios.sort((a, b) => a.numeroEpisodio - b.numeroEpisodio);
});

const playEpisode = (episodeUrl) => {
  // Aquí hay un truco: Como el PlayerView actual espera un ID de película para buscar en BD,
  // y los episodios son distintos, por ahora pasaremos la URL directa codificada.
  // Más adelante ajustaremos el Player para que soporte esto mejor.
  const encodedUrl = encodeURIComponent(episodeUrl);
  router.push(`/player/custom?url=${encodedUrl}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans pb-20">
    
    <div v-if="loading" class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
    </div>

    <div v-else-if="serie">
        
      <div class="relative h-[70vh] w-full">
        <div class="absolute inset-0">
            <img :src="serie.imgBanner" class="w-full h-full object-cover" alt="Banner" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
            <h1 class="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {{ serie.titulo }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-300 mb-6">
                <span class="text-green-400">{{ serie.estadoSerie }}</span>
                <span>{{ serie.anioLanzamiento }}</span>
                <span class="border border-gray-600 px-2 rounded">{{ serie.totalTemporadas }} Temporadas</span>
            </div>

            <p class="text-lg text-gray-300 max-w-2xl line-clamp-3 mb-8">
                {{ serie.descripcion }}
            </p>

            <button @click="router.back()" class="self-start px-6 py-2 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-lg backdrop-blur transition flex items-center gap-2">
                ← Volver al catálogo
            </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 mt-8">
        <div class="flex overflow-x-auto gap-4 border-b border-gray-800 pb-2 mb-6 scrollbar-hide">
            <button 
                v-for="(season, index) in serie.temporadas" 
                :key="season.id"
                @click="activeSeasonIndex = index"
                :class="`px-6 py-3 text-lg font-bold transition whitespace-nowrap border-b-4 ${activeSeasonIndex === index ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`"
            >
                {{ season.titulo || `Temporada ${season.numeroTemporada}` }}
            </button>
        </div>

        <div class="space-y-4">
            <div v-if="currentEpisodes.length === 0" class="text-gray-500 text-center py-10">
                No hay episodios disponibles en esta temporada.
            </div>

            <div 
                v-for="episodio in currentEpisodes" 
                :key="episodio.id"
                class="group flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl hover:bg-gray-800 transition border border-transparent hover:border-gray-700 cursor-pointer"
                @click="playEpisode(episodio.urlStream)"
            >
                <div class="relative w-full md:w-64 aspect-video flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                    <img :src="episodio.imgMiniatura || serie.imgPortada" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                        <div class="bg-white text-black rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="flex-1 text-center md:text-left">
                    <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <span class="text-purple-400 font-bold text-lg">{{ episodio.numeroEpisodio }}.</span>
                        <h3 class="text-xl font-bold text-gray-100">{{ episodio.titulo }}</h3>
                    </div>
                    <p class="text-gray-400 text-sm line-clamp-2">{{ episodio.descripcion }}</p>
                </div>
                
                <div class="text-gray-500 text-sm font-medium">
                    {{ episodio.duracionMinutos }} min
                </div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>