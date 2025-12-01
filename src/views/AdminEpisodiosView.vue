<script setup>
import { ref, onMounted } from 'vue'; // Quitamos 'computed' que no se usaba
import { useRoute, useRouter } from 'vue-router';
import SerieService from '../services/SerieService';

const route = useRoute();
const router = useRouter();

const serie = ref(null);
const loading = ref(true);
const activeSeasonIndex = ref(0); // Qué temporada estamos editando

// Estado del Modal de Episodio
const showEpisodeModal = ref(false);
const editingEpisodeIndex = ref(-1); // -1 si es nuevo, índice si es editar
const episodeForm = ref({
  numeroEpisodio: 1,
  titulo: '',
  descripcion: '',
  duracionMinutos: 0,
  urlStream: '',
  imgMiniatura: ''
});

onMounted(async () => {
  await loadSerie();
});

const loadSerie = async () => {
  loading.value = true;
  try {
    const data = await SerieService.getById(route.params.id);
    // Inicializar temporadas si viene nulo
    if (!data.temporadas) data.temporadas = [];
    // Ordenar visualmente
    data.temporadas.sort((a, b) => a.numeroTemporada - b.numeroTemporada);
    
    serie.value = data;
  } catch (error) {
    console.error(error); // Ver error en consola
    alert("Error cargando serie o ID inválido");
    router.push('/admin/series'); // Volver a la lista si falla
  } finally {
    loading.value = false;
  }
};

// --- GESTIÓN DE TEMPORADAS ---

const addSeason = () => {
  // Validación de seguridad: serie debe existir
  if (!serie.value) return;

  const nextNumber = serie.value.temporadas.length + 1;
  serie.value.temporadas.push({
    numeroTemporada: nextNumber,
    titulo: `Temporada ${nextNumber}`,
    fechaEstreno: new Date().toISOString().split('T')[0],
    episodios: []
  });
  activeSeasonIndex.value = serie.value.temporadas.length - 1;
};

const removeSeason = (index) => {
  if (!confirm("¿Borrar esta temporada y sus episodios?")) return;
  serie.value.temporadas.splice(index, 1);
  if (activeSeasonIndex.value >= serie.value.temporadas.length) {
    activeSeasonIndex.value = Math.max(0, serie.value.temporadas.length - 1);
  }
};

// --- GESTIÓN DE EPISODIOS ---

const openEpisodeModal = (index = -1) => {
  editingEpisodeIndex.value = index;
  const currentSeason = serie.value.temporadas[activeSeasonIndex.value];
  
  if (index === -1) {
    // Nuevo Episodio
    const nextEpNum = currentSeason.episodios ? currentSeason.episodios.length + 1 : 1;
    
    episodeForm.value = {
      numeroEpisodio: nextEpNum,
      titulo: `Episodio ${nextEpNum}`,
      descripcion: '',
      duracionMinutos: 45,
      urlStream: '',
      imgMiniatura: ''
    };
  } else {
    // Editar Existente
    const ep = currentSeason.episodios[index];
    episodeForm.value = { ...ep };
  }
  showEpisodeModal.value = true;
};

const saveEpisodeLocal = () => {
  const currentSeason = serie.value.temporadas[activeSeasonIndex.value];
  if (!currentSeason.episodios) currentSeason.episodios = [];

  if (editingEpisodeIndex.value === -1) {
    currentSeason.episodios.push({ ...episodeForm.value });
  } else {
    currentSeason.episodios[editingEpisodeIndex.value] = { ...episodeForm.value };
  }
  showEpisodeModal.value = false;
};

const removeEpisode = (index) => {
  if (!confirm("¿Borrar episodio?")) return;
  serie.value.temporadas[activeSeasonIndex.value].episodios.splice(index, 1);
};

// --- GUARDADO FINAL EN BACKEND ---

const saveAllChanges = async () => {
  if (!confirm("¿Guardar todos los cambios en la base de datos?")) return;
  
  try {
    // Enviamos el objeto serie completo. El backend hará el 'Merge'.
    await SerieService.update(serie.value.id, serie.value);
    alert("¡Cambios guardados exitosamente!");
    loadSerie(); 
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error || "Error al guardar cambios en el servidor.");
  }
};

</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
    
    <div v-if="loading" class="text-center mt-20">Cargando estructura...</div>

    <div v-else-if="serie" class="max-w-7xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
      
      <div class="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ serie.titulo }}</h1>
          <p class="text-sm text-gray-400">Gestor de contenido</p>
        </div>
        <div class="flex gap-3">
          <button @click="saveAllChanges" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition flex items-center gap-2">
            💾 Guardar Todo
          </button>
          <button @click="router.back()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Volver</button>
        </div>
      </div>

      <div class="flex flex-1 gap-6 overflow-hidden">
        
        <div class="w-1/4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
            <h3 class="font-bold text-gray-300">Temporadas</h3>
            <button @click="addSeason" class="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500">+ Nueva</button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-2 space-y-2">
            <div 
              v-for="(season, index) in serie.temporadas" 
              :key="index"
              @click="activeSeasonIndex = index"
              class="group flex justify-between items-center p-3 rounded-lg cursor-pointer transition border"
              :class="activeSeasonIndex === index ? 'bg-blue-900/30 border-blue-500 text-white' : 'bg-gray-700/30 border-transparent hover:bg-gray-700 text-gray-400'"
            >
              <div class="truncate">
                 <span class="font-bold block">T{{ season.numeroTemporada }}</span>
                 <span class="text-xs opacity-70">{{ season.titulo }}</span>
              </div>
              <button @click.stop="removeSeason(index)" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1">✕</button>
            </div>

            <div v-if="serie.temporadas.length === 0" class="text-center text-sm text-gray-500 py-4">
                Sin temporadas
            </div>
          </div>
        </div>

        <div class="w-3/4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
          
          <div v-if="serie.temporadas.length > 0" class="flex-1 flex flex-col">
             <div class="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                <div class="flex gap-4">
                    <input v-model="serie.temporadas[activeSeasonIndex].numeroTemporada" type="number" class="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-center" title="Número Temporada">
                    <input v-model="serie.temporadas[activeSeasonIndex].titulo" class="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-64" placeholder="Título Temporada">
                </div>
                <button @click="openEpisodeModal()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span>+</span> Agregar Episodio
                </button>
             </div>

             <div class="flex-1 overflow-y-auto p-4 space-y-3">
                <div 
                    v-for="(ep, index) in serie.temporadas[activeSeasonIndex].episodios" 
                    :key="index"
                    class="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-500 transition group"
                >
                    <div class="w-10 h-10 bg-gray-800 rounded flex items-center justify-center font-bold text-gray-500">
                        {{ ep.numeroEpisodio }}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-200">{{ ep.titulo }}</h4>
                        <p class="text-xs text-gray-500 truncate w-96">{{ ep.urlStream }}</p>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-gray-400">
                        <span>{{ ep.duracionMinutos }} min</span>
                        <button @click="openEpisodeModal(index)" class="text-blue-400 hover:text-blue-300">Editar</button>
                        <button @click="removeEpisode(index)" class="text-red-400 hover:text-red-300">Borrar</button>
                    </div>
                </div>

                <div v-if="!serie.temporadas[activeSeasonIndex].episodios?.length" class="text-center py-20 text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                    Esta temporada no tiene episodios aún.
                </div>
             </div>
          </div>

          <div v-else class="flex-1 flex items-center justify-center text-gray-500">
              Selecciona o crea una temporada para ver sus episodios.
          </div>
        </div>

      </div>
    </div>

    <div v-if="showEpisodeModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-600">
            <h3 class="text-xl font-bold mb-4 text-white">
                {{ editingEpisodeIndex === -1 ? 'Nuevo Episodio' : 'Editar Episodio' }}
            </h3>
            
            <form @submit.prevent="saveEpisodeLocal" class="space-y-4">
                <div class="flex gap-4">
                    <div class="w-1/4">
                        <label class="label">Nº</label>
                        <input v-model="episodeForm.numeroEpisodio" type="number" class="input-dark" required>
                    </div>
                    <div class="w-3/4">
                        <label class="label">Título</label>
                        <input v-model="episodeForm.titulo" class="input-dark" required>
                    </div>
                </div>
                
                <div>
                    <label class="label">Descripción</label>
                    <textarea v-model="episodeForm.descripcion" rows="2" class="input-dark"></textarea>
                </div>

                <div class="flex gap-4">
                    <div class="w-1/3">
                        <label class="label">Duración (min)</label>
                        <input v-model="episodeForm.duracionMinutos" type="number" class="input-dark">
                    </div>
                    <div class="w-2/3">
                         <label class="label">URL Video</label>
                         <input v-model="episodeForm.urlStream" class="input-dark" required placeholder="https://...">
                    </div>
                </div>

                <div>
                     <label class="label">Miniatura URL (Opcional)</label>
                     <input v-model="episodeForm.imgMiniatura" class="input-dark" placeholder="https://...">
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" @click="showEpisodeModal = false" class="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold text-white">Confirmar</button>
                </div>
            </form>
        </div>
    </div>

  </div>
</template>

<style scoped>
.label { @apply block text-xs text-gray-400 mb-1; }
.input-dark { @apply w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-sm; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #1f2937; }
::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #6b7280; }
</style>