<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContentService from '../services/ContentService';
import EcommerceService from '../services/EcommerceService';

const route = useRoute();
const router = useRouter();
const movie = ref(null);
const loading = ref(true);
const hasAccess = ref(false);

onMounted(async () => {
  const movieId = route.params.id;
  try {
    movie.value = await ContentService.getById(movieId);
    
    // Verificamos acceso solo si cargó la película
    if (movie.value) {
        try {
          hasAccess.value = await EcommerceService.checkAccess(movie.value.id);
        } catch (e) {
          console.error("Error verificando acceso");
        }
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la película");
    router.push('/home');
  } finally {
    loading.value = false;
  }
});

// --- FUNCIONES (FUERA DE ONMOUNTED) ---

const addToCart = async () => {
  try {
    await EcommerceService.addToCart(movie.value.id);
    if(confirm("Agregado al carrito. ¿Ir a pagar?")) {
        router.push('/carrito');
    }
  } catch (error) {
    alert(error.response?.data?.error || "Error al agregar");
  }
};

const playMovie = () => {
  router.push(`/player/${movie.value.id}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    
    <div v-if="loading" class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>

    <div v-else-if="movie" class="relative min-h-screen">
        
      <div class="absolute inset-0 w-full h-full">
        <img :src="movie.imgBanner" class="w-full h-full object-cover" alt="Banner" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-20 min-h-screen flex items-center">
        <div class="flex flex-col md:flex-row gap-10 items-center md:items-end">
            
            <img :src="movie.imgPortada" class="w-64 rounded-lg shadow-2xl border-2 border-gray-700 hidden md:block transform hover:scale-105 transition duration-500" />

            <div class="max-w-2xl space-y-6">
                <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    {{ movie.titulo }}
                </h1>
                
                <div class="flex flex-wrap gap-4 text-sm font-semibold text-gray-300">
                    <span class="px-2 py-1 bg-gray-800 rounded border border-gray-600">{{ movie.anioLanzamiento }}</span>
                    <span>{{ movie.duracionMinutos }} min</span>
                </div>

                <div class="flex gap-2">
                    <span v-for="g in movie.generos" :key="g.id" class="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">
                        {{ g.nombre }}
                    </span>
                </div>

                <p class="text-lg text-gray-300 leading-relaxed">
                    {{ movie.descripcion }}
                </p>

                <div class="flex flex-wrap gap-4 pt-4">
    
                  <button 
                      v-if="hasAccess || movie.precio == 0" 
                      @click="playMovie" 
                      class="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition flex items-center gap-2 shadow-lg shadow-white/10"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                          <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                      </svg>
                      Reproducir
                  </button>

                  <button 
                      v-else 
                      @click="addToCart"
                      class="px-8 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      Comprar por ${{ movie.precio }}
                  </button>
                  
                  <button @click="router.back()" class="px-6 py-3 bg-gray-600/80 text-white font-bold rounded hover:bg-gray-500 transition backdrop-blur-sm">
                      Volver
                  </button>
              </div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>