<script setup>
import { ref, onMounted } from 'vue';
import EcommerceService from '../services/EcommerceService';
import { useRouter } from 'vue-router';

const router = useRouter();
const library = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    library.value = await EcommerceService.getLibrary();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans p-6">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center mb-8 pt-4">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Mi Biblioteca
        </h1>
        <button @click="router.push('/home')" class="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700">Volver</button>
      </div>

      <div v-if="loading" class="text-center text-gray-500">Cargando tus compras...</div>

      <div v-else-if="library.length === 0" class="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
        <p class="text-xl text-gray-400 mb-4">Aún no has comprado nada.</p>
        <button @click="router.push('/home')" class="text-blue-400 hover:underline">Explorar Catálogo</button>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="item in library" :key="item.id" class="group relative cursor-pointer" @click="router.push(`/ver/${item.contenidoId}`)">
           <div class="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group-hover:border-cyan-500 transition">
              <img :src="item.imgPortada" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span class="bg-cyan-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">VER AHORA</span>
              </div>
           </div>
           <h3 class="mt-2 font-medium truncate">{{ item.titulo }}</h3>
           <span class="text-xs text-cyan-400 uppercase font-bold">Comprado</span>
        </div>
      </div>

    </div>
  </div>
</template>