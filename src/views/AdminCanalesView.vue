<script setup>
import { ref, onMounted } from 'vue';
import CanalService from '../services/CanalService';
import GeneroService from '../services/GeneroService';
import { useRouter } from 'vue-router';

const router = useRouter();

// Data
const canales = ref([]);
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
  imgPortada: '', imgBanner: '', urlStream: '',
  precio: 0.00, estaActivo: true, 
  tipoTransmision: 'HLS', pais: 'Internacional',
  generosIds: []
});

onMounted(async () => {
  await loadGeneros();
  loadCanales(0);
});

const loadGeneros = async () => {
  try { allGeneros.value = await GeneroService.getAll(); } catch (e) {}
};

const loadCanales = async (page) => {
  loading.value = true;
  try {
    const data = await CanalService.getAllAdmin(page, 5);
    canales.value = data.content;
    currentPage.value = data.number;
    totalPages.value = data.totalPages;
  } catch (error) {
    errorMsg.value = "Error cargando canales";
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    id: null, titulo: '', slug: '', descripcion: '',
    imgPortada: '', imgBanner: '', urlStream: '',
    precio: 0.00, estaActivo: true,
    tipoTransmision: 'HLS', pais: 'Internacional',
    generosIds: []
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = {
    ...item,
    generosIds: item.generos.map(g => g.id)
  };
  showModal.value = true;
};

const saveCanal = async () => {
  try {
    if (isEditing.value) {
      await CanalService.update(form.value.id, form.value);
    } else {
      await CanalService.create(form.value);
    }
    showModal.value = false;
    loadCanales(currentPage.value);
  } catch (error) {
    alert(error.response?.data?.error || "Error al guardar");
  }
};

const deleteCanal = async (id) => {
  if(!confirm("¿Eliminar este canal?")) return;
  try {
    await CanalService.delete(id);
    loadCanales(currentPage.value);
  } catch (error) {
    alert("Error al eliminar");
  }
};

const prevPage = () => { if (currentPage.value > 0) loadCanales(currentPage.value - 1); };
const nextPage = () => { if (currentPage.value < totalPages.value - 1) loadCanales(currentPage.value + 1); };
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Canales en Vivo</h1>
          <p class="text-gray-400 text-sm mt-1">Gestión de IPTV y Streaming</p>
        </div>
        <div class="flex gap-3">
          <button @click="router.push('/admin')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm">Volver</button>
          <button @click="openCreateModal" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
            <span>+</span> Nuevo Canal
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th class="p-4">Logo</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">País</th>
                <th class="p-4">Stream</th>
                <th class="p-4">Estado</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="c in canales" :key="c.id" class="hover:bg-gray-700/30 transition">
                <td class="p-4">
                  <img :src="c.imgPortada" class="h-10 w-10 object-contain rounded bg-white/10 p-1" alt="Logo"/>
                </td>
                <td class="p-4">
                  <p class="font-bold text-white">{{ c.titulo }}</p>
                  <p class="text-xs text-gray-500 truncate w-40">{{ c.slug }}</p>
                </td>
                <td class="p-4">{{ c.pais }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{{ c.tipoTransmision }}</span>
                </td>
                <td class="p-4">
                  <span :class="`px-2 py-1 rounded text-xs font-bold ${c.estaActivo ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`">
                    {{ c.estaActivo ? 'En Aire' : 'Offline' }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button @click="openEditModal(c)" class="text-blue-400 hover:text-blue-300">✏️</button>
                  <button @click="deleteCanal(c.id)" class="text-red-400 hover:text-red-300">🗑️</button>
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
          <h2 class="text-xl font-bold text-white">{{ isEditing ? 'Editar Canal' : 'Nuevo Canal' }}</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveCanal" class="p-6 space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Nombre Canal</label>
              <input v-model="form.titulo" required class="input-dark" />
            </div>
            <div>
              <label class="label">Slug (URL)</label>
              <input v-model="form.slug" required class="input-dark" placeholder="ej: espn-vivo" />
            </div>
          </div>

          <div>
            <label class="label">Descripción</label>
            <textarea v-model="form.descripcion" rows="2" class="input-dark"></textarea>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="label">País</label>
              <input v-model="form.pais" class="input-dark" placeholder="Ej: México" />
            </div>
            <div>
              <label class="label">Tipo</label>
              <select v-model="form.tipoTransmision" class="input-dark">
                  <option value="HLS">HLS (.m3u8)</option>
                  <option value="DASH">DASH (.mpd)</option>
                  <option value="RTMP">RTMP</option>
                  <option value="YOUTUBE">YouTube Live</option>
              </select>
            </div>
            <div class="flex items-end pb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.estaActivo" class="w-5 h-5 rounded accent-green-500" />
                <span class="text-white">¿Activo?</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Logo URL</label>
              <input v-model="form.imgPortada" placeholder="https://..." class="input-dark" />
            </div>
            <div>
              <label class="label">Banner URL (Fondo)</label>
              <input v-model="form.imgBanner" placeholder="https://..." class="input-dark" />
            </div>
          </div>

          <div>
            <label class="label">URL Stream (En Vivo)</label>
            <input v-model="form.urlStream" placeholder="https://...index.m3u8" class="input-dark" required />
          </div>

          <div>
            <label class="label mb-2">Categoría</label>
            <div class="flex flex-wrap gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700 max-h-32 overflow-y-auto">
              <label v-for="g in allGeneros" :key="g.id" class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-700 rounded transition">
                <input type="checkbox" :value="g.id" v-model="form.generosIds" class="rounded accent-red-500" />
                <span class="text-sm text-gray-300">{{ g.nombre }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
            <button type="submit" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Guardar</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.label { @apply block text-sm text-gray-400 mb-1; }
.input-dark { @apply w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-red-500; }
</style>