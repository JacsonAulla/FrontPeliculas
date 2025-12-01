<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContentService from '../services/ContentService';
import CanalService from '../services/CanalService'; // Importar servicio de canales
import VideoPlayer from '../components/VideoPlayer.vue'; // 1. Importar Componente

const route = useRoute();
const router = useRouter();
const videoUrl = ref('');
const posterUrl = ref(''); // Para mostrar imagen mientras carga
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;

  try {
    // CASO A: Custom URL (Episodios)
    if (id === 'custom') {
      const urlParam = route.query.url;
      if (urlParam) videoUrl.value = decodeURIComponent(urlParam);
    
    } else {
      // CASO B: Buscar en BD (Puede ser Película o Canal)
      // Intentamos primero como Película
      try {
        const movie = await ContentService.getById(id);
        videoUrl.value = movie.urlStream;
        posterUrl.value = movie.imgBanner || movie.imgPortada;
      } catch (e) {
        // Si falla, intentamos como Canal
        const canal = await CanalService.getById(id);
        videoUrl.value = canal.urlStream;
        posterUrl.value = canal.imgBanner;
      }
    }
  } catch (error) {
    console.error(error);
    alert("Error: No se pudo cargar el contenido.");
    router.back();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-black h-screen w-screen flex items-center justify-center relative overflow-hidden">
    
    <button 
        @click="router.back()" 
        class="absolute top-6 left-6 z-50 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 p-3 rounded-full transition backdrop-blur-md"
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    </button>

    <div v-if="loading" class="text-white animate-pulse text-xl">Cargando reproductor...</div>

    <div v-else-if="videoUrl" class="w-full h-full max-w-6xl max-h-screen">
        <VideoPlayer :src="videoUrl" :poster="posterUrl" />
    </div>

  </div>
</template>