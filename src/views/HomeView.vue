<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ContentService from '../services/ContentService';
import SerieService from '../services/SerieService';
import CanalService from '../services/CanalService';

const router = useRouter();
const user = ref(null);

// Datos de contenido
const recentMovies = ref([]);
const recentSeries = ref([]);
const recentChannels = ref([]);
const loading = ref(true);

onMounted(async () => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !userData) {
    logout();
    return;
  }
  user.value = JSON.parse(userData);

  // Cargar datos del Backend
  await loadContent();
});

const loadContent = async () => {
  try {
    // 1. Cargar Películas (Solo las 4 más recientes para el Home)
    const moviesData = await ContentService.getPeliculas(0, 4);
    recentMovies.value = moviesData.content;
    
    const seriesData = await SerieService.getActiveSeries(0, 4);
    recentSeries.value = seriesData.content;

    const canalesData = await CanalService.getActiveCanales(0, 4);
    recentChannels.value = canalesData.content;

  } catch (error) {
    console.error("Error cargando contenido", error);
  } finally {
    loading.value = false;
  }
};

const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN');

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};

// Navegación a las páginas de "Ver Todo"
const goTo = (route) => router.push(route);
</script>

<template>
  <div class="min-h-screen bg-gray-900 font-sans text-gray-100 pb-20">
    
    <nav class="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 fixed w-full z-50 top-0 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <div class="flex items-center gap-2 cursor-pointer group" @click="router.push('/home')">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition">M</div>
            <span class="font-bold text-xl tracking-tight group-hover:text-blue-400 transition">MediaWeseco</span>
          </div>

          <div class="flex items-center gap-4" v-if="user">
            <router-link v-if="isAdmin" to="/admin" class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-md transition shadow-md hover:shadow-red-500/20">
              <span>⚙️</span> Admin Panel
            </router-link>
            <router-link to="/biblioteca" class="text-gray-300 hover:text-white text-sm font-medium px-3">Mi Lista</router-link>
            <router-link to="/planes" class="text-yellow-400 hover:text-yellow-300 text-sm font-bold px-3 border border-yellow-500/50 rounded py-1 mr-2">Premium</router-link>

      
            
            <button 
              @click="router.push('/carrito')" 
              class="p-2 text-gray-300 hover:text-white relative transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </button>

            <button @click="logout" class="ml-2 p-2 text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>

            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-white">{{ user.username || user.email }}</p>
              <p class="text-xs text-gray-400 uppercase tracking-wider">{{ user.role }}</p>
            </div>
            
            <img :src="user.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" class="h-10 w-10 rounded-full border-2 border-gray-700 object-cover" />
          </div>
        </div>
      </div>
    </nav>

    <header class="pt-28 pb-10 px-4 max-w-7xl mx-auto text-center sm:text-left">
      <h1 class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Hola, {{ user?.username || 'Usuario' }}
      </h1>
      <p class="text-gray-400 text-lg">¿Qué quieres ver hoy?</p>
    </header>

    <main class="max-w-7xl mx-auto px-4 space-y-12">
      
      <section>
        <div class="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            🎬 Películas Recientes
          </h2>
          <button @click="goTo('/peliculas')" class="text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center gap-1">
            Ver todas <span>→</span>
          </button>
        </div>

        <div v-if="loading" class="text-gray-500">Cargando contenido...</div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="peli in recentMovies" :key="peli.id" class="group relative cursor-pointer" @click="router.push(`/ver/${peli.id}`)">
            <div class="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 cursor-pointer">
              <img :src="peli.imgPortada" class="w-full h-full object-cover" loading="lazy" alt="Portada"/>
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <button class="bg-blue-600 text-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition duration-300 delay-75 shadow-lg">
                  ▶
                </button>
              </div>
            </div>
            <h3 class="mt-3 text-white font-semibold truncate">{{ peli.titulo }}</h3>
            <p class="text-sm text-gray-500">{{ peli.anioLanzamiento }}</p>
          </div>
        </div>
      </section>

      <section>
        <div class="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            📺 Series Populares
          </h2>
          <button @click="goTo('/series')" class="text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center gap-1">
            Ver todas <span>→</span>
          </button>
        </div>

        <div v-if="loading" class="text-gray-500">Cargando series...</div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div 
            v-for="serie in recentSeries" 
            :key="serie.id" 
            class="group relative cursor-pointer"
            @click="router.push(`/ver/serie/${serie.id}`)" 
          >
            <div class="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-purple-500/20">
              <img :src="serie.imgPortada" class="w-full h-full object-cover" loading="lazy" alt="Portada"/>
              
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div class="text-center">
                    <span class="block text-white font-bold text-lg">Ver</span>
                    <span class="text-xs text-gray-300">{{ serie.totalTemporadas }} Temporadas</span>
                </div>
              </div>
            </div>

            <h3 class="mt-3 text-white font-semibold truncate">{{ serie.titulo }}</h3>
            <p class="text-sm text-gray-500 flex items-center gap-2">
                <span>{{ serie.anioLanzamiento }}</span>
                <span class="text-xs bg-gray-800 px-1 rounded border border-gray-700 text-gray-400">{{ serie.estadoSerie }}</span>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div class="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            📡 Canales en Vivo
          </h2>
          <button @click="goTo('/canales')" class="text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center gap-1">
            Ver todos <span>→</span>
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div 
            v-for="canal in recentChannels" 
            :key="canal.id" 
            class="group relative cursor-pointer"
            @click="router.push(`/player/${canal.id}`)" 
          >
            <div class="aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition duration-300 group-hover:scale-105 group-hover:border-red-500 relative">
              
              <div class="absolute inset-0 flex items-center justify-center p-4">
                 <img :src="canal.imgPortada" class="max-h-16 max-w-full object-contain drop-shadow-lg" alt="Logo"/>
              </div>
              
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <span class="text-red-500 font-bold bg-white px-3 py-1 rounded-full shadow-lg text-xs">EN VIVO</span>
              </div>
            </div>

            <h3 class="mt-2 text-white font-semibold truncate text-center">{{ canal.titulo }}</h3>
            <p class="text-xs text-gray-500 text-center">{{ canal.pais }}</p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>