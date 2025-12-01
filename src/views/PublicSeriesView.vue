<script setup>
import { ref, onMounted } from 'vue';
import SerieService from '../services/SerieService';
import { useRouter } from 'vue-router';

const router = useRouter();
const series = ref([]);
const loading = ref(true);
const page = ref(0);
const totalPages = ref(0);

onMounted(() => loadSeries(0));

const loadSeries = async (pageNumber) => {
  loading.value = true;
  try {
    const data = await SerieService.getActiveSeries(pageNumber, 12);
    series.value = data.content;
    page.value = data.number;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    loadSeries(newPage);
    window.scrollTo(0, 0);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    
    <div class="max-w-7xl mx-auto flex items-center justify-between mb-8 pt-4">
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Catálogo de Series
      </h1>
      <button @click="router.push('/home')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition">
        ← Volver
      </button>
    </div>

    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando series...</div>
      
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div 
            v-for="serie in series" 
            :key="serie.id" 
            class="group relative cursor-pointer"
            @click="router.push(`/ver/serie/${serie.id}`)"
        >
          <div class="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-transparent group-hover:border-purple-500/50 transition duration-300">
            <img :src="serie.imgPortada" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" loading="lazy"/>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span class="text-xs font-bold text-purple-300 mb-1">{{ serie.totalTemporadas }} Temporadas</span>
              <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-bold shadow-lg hover:bg-purple-500 transition">
                Ver Capítulos
              </button>
            </div>
          </div>
          <h3 class="mt-2 font-semibold truncate text-gray-200">{{ serie.titulo }}</h3>
          <p class="text-xs text-gray-500">{{ serie.anioLanzamiento }} • {{ serie.estadoSerie }}</p>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-12" v-if="totalPages > 1">
        <button @click="changePage(page - 1)" :disabled="page === 0" class="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700">Anterior</button>
        <span class="py-2 text-gray-400">Página {{ page + 1 }} de {{ totalPages }}</span>
        <button @click="changePage(page + 1)" :disabled="page >= totalPages - 1" class="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700">Siguiente</button>
      </div>
    </div>

  </div>
</template>