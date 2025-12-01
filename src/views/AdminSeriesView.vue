<script setup>
import { ref, onMounted } from 'vue';
import SerieService from '../services/SerieService';
import GeneroService from '../services/GeneroService';
import { useRouter } from 'vue-router';

const router = useRouter();

// Data
const series = ref([]);
const allGeneros = ref([]);
const loading = ref(false);
const errorMsg = ref('');

// Paginación
const currentPage = ref(0);
const totalPages = ref(0);

// Modal y Formulario
const showModal = ref(false);
const isEditing = ref(false);
const form = ref({
  id: null, titulo: '', slug: '', descripcion: '',
  anioLanzamiento: 2024, imgPortada: '', imgBanner: '',
  precio: 0.00, estaActivo: true, 
  estadoSerie: 'FINALIZADA', totalTemporadas: 1,
  generosIds: [], temporadas: [] // Por ahora vacío
});

onMounted(async () => {
  await loadGeneros();
  loadSeries(0);
});

const loadGeneros = async () => {
  try { allGeneros.value = await GeneroService.getAll(); } catch (e) {}
};

const loadSeries = async (page) => {
  loading.value = true;
  try {
    const data = await SerieService.getAllAdmin(page, 5);
    series.value = data.content;
    currentPage.value = data.number;
    totalPages.value = data.totalPages;
  } catch (error) {
    errorMsg.value = "Error cargando series";
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    id: null, titulo: '', slug: '', descripcion: '',
    anioLanzamiento: 2024, imgPortada: '', imgBanner: '',
    precio: 0.00, estaActivo: true, 
    estadoSerie: 'FINALIZADA', totalTemporadas: 1,
    generosIds: [], temporadas: []
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = {
    ...item,
    generosIds: item.generos.map(g => g.id),
    temporadas: item.temporadas || []
  };
  showModal.value = true;
};

const saveSerie = async () => {
  try {
    if (isEditing.value) {
      await SerieService.update(form.value.id, form.value);
    } else {
      await SerieService.create(form.value);
    }
    showModal.value = false;
    loadSeries(currentPage.value);
  } catch (error) {
    alert(error.response?.data?.error || "Error al guardar");
  }
};

const deleteSerie = async (id) => {
  if(!confirm("¿Eliminar esta serie y todos sus episodios?")) return;
  try {
    await SerieService.delete(id);
    loadSeries(currentPage.value);
  } catch (error) {
    alert("Error al eliminar");
  }
};

const prevPage = () => { if (currentPage.value > 0) loadSeries(currentPage.value - 1); };
const nextPage = () => { if (currentPage.value < totalPages.value - 1) loadSeries(currentPage.value + 1); };
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Series</h1>
          <p class="text-gray-400 text-sm mt-1">Gestiona el catálogo de TV</p>
        </div>
        <div class="flex gap-3">
          <button @click="router.push('/admin')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm">Volver</button>
          <button @click="openCreateModal" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
            <span>+</span> Nueva Serie
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th class="p-4">Portada</th>
                <th class="p-4">Título</th>
                <th class="p-4">Año</th>
                <th class="p-4">Estado</th>
                <th class="p-4">Visibilidad</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="s in series" :key="s.id" class="hover:bg-gray-700/30 transition">
                <td class="p-4">
                  <img :src="s.imgPortada" class="h-16 w-10 object-cover rounded bg-gray-900" alt="Cover"/>
                </td>
                <td class="p-4">
                  <p class="font-bold text-white">{{ s.titulo }}</p>
                  <p class="text-xs text-gray-500 truncate w-40">{{ s.slug }}</p>
                </td>
                <td class="p-4">{{ s.anioLanzamiento }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{{ s.estadoSerie }}</span>
                </td>
                <td class="p-4">
                  <span :class="`px-2 py-1 rounded text-xs font-bold ${s.estaActivo ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`">
                    {{ s.estaActivo ? 'Público' : 'Borrador' }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button @click="openEditModal(s)" class="text-blue-400 hover:text-blue-300" title="Editar Info">✏️</button>
                  <button 
                    @click="router.push(`/admin/series/${s.id}/episodios`)" 
                    class="text-green-400 hover:text-green-300" 
                    title="Gestionar Episodios"
                  >
                    📺
                  </button>
                  <button @click="deleteSerie(s.id)" class="text-red-400 hover:text-red-300" title="Eliminar">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-4 border-t border-gray-700 flex justify-between items-center">
            <button @click="prevPage" :disabled="currentPage === 0" class="text-gray-400 hover:text-white disabled:opacity-50">Anterior</button>
            <span class="text-sm">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages - 1" class="text-gray-400 hover:text-white disabled:opacity-50">Siguiente</button>
        </div>
      </div>

    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700 my-10">
        
        <div class="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">{{ isEditing ? 'Editar Serie' : 'Nueva Serie' }}</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveSerie" class="p-6 space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Título</label>
              <input v-model="form.titulo" required class="input-dark" />
            </div>
            <div>
              <label class="label">Slug (URL)</label>
              <input v-model="form.slug" required class="input-dark" placeholder="ej: breaking-bad" />
            </div>
          </div>

          <div>
            <label class="label">Descripción</label>
            <textarea v-model="form.descripcion" rows="3" class="input-dark"></textarea>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="label">Año</label>
              <input v-model="form.anioLanzamiento" type="number" class="input-dark" />
            </div>
            <div>
              <label class="label">Estado</label>
              <select v-model="form.estadoSerie" class="input-dark">
                  <option value="FINALIZADA">Finalizada</option>
                  <option value="EMISION">En Emisión</option>
                  <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div class="flex items-end pb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.estaActivo" class="w-5 h-5 rounded accent-green-500" />
                <span class="text-white">¿Público?</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">URL Portada (Poster)</label>
              <input v-model="form.imgPortada" placeholder="https://..." class="input-dark" />
            </div>
            <div>
              <label class="label">URL Banner (Fondo)</label>
              <input v-model="form.imgBanner" placeholder="https://..." class="input-dark" />
            </div>
          </div>

          <div>
            <label class="label mb-2">Géneros</label>
            <div class="flex flex-wrap gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700 max-h-32 overflow-y-auto">
              <label v-for="g in allGeneros" :key="g.id" class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-700 rounded transition">
                <input type="checkbox" :value="g.id" v-model="form.generosIds" class="rounded accent-purple-500" />
                <span class="text-sm text-gray-300">{{ g.nombre }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
            <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">Guardar</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.label { @apply block text-sm text-gray-400 mb-1; }
.input-dark { @apply w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-500; }
</style>