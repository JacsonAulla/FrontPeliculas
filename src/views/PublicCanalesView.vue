<script setup>
import { ref, onMounted } from 'vue';
import CanalService from '../services/CanalService';
import { useRouter } from 'vue-router';

const router = useRouter();
const canales = ref([]);
const loading = ref(true);
const page = ref(0);
const totalPages = ref(0);

onMounted(() => loadCanales(0));

const loadCanales = async (pageNumber) => {
  loading.value = true;
  try {
    const data = await CanalService.getActiveCanales(pageNumber, 12);
    canales.value = data.content;
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
    loadCanales(newPage);
    window.scrollTo(0, 0);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    
    <div class="max-w-7xl mx-auto flex items-center justify-between mb-8 pt-4">
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
        TV en Vivo
      </h1>
      <button @click="router.push('/home')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition">
        ← Volver
      </button>
    </div>

    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="text-center py-20 text-gray-500">Sintonizando canales...</div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
            v-for="canal in canales" 
            :key="canal.id" 
            class="group relative cursor-pointer bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition duration-300 hover:shadow-red-900/20 shadow-lg"
            @click="router.push(`/player/${canal.id}`)"
        >
          <div class="aspect-video flex items-center justify-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-800 group-hover:to-gray-700 transition">
            <img :src="canal.imgPortada" class="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition duration-500" loading="lazy" alt="Logo"/>
          </div>

          <div class="p-3 flex justify-between items-center border-t border-gray-700 bg-gray-800">
             <div>
                 <h3 class="font-bold text-white truncate w-32">{{ canal.titulo }}</h3>
                 <p class="text-xs text-gray-500">{{ canal.pais }}</p>
             </div>
             <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span class="text-xs font-bold text-red-500">LIVE</span>
             </div>
          </div>

          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
             <button class="bg-red-600 text-white rounded-full p-3 shadow-xl transform scale-0 group-hover:scale-100 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
             </button>
          </div>

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