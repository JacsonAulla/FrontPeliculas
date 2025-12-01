<script setup>
import { ref, onMounted } from 'vue';
import GeneroService from '../services/GeneroService';
import { useRouter } from 'vue-router';

const router = useRouter();
const generos = ref([]);
const loading = ref(false);

// Estado del Modal
const showModal = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, nombre: '' });
const errorMsg = ref('');

onMounted(() => {
  loadGeneros();
});

const loadGeneros = async () => {
  loading.value = true;
  try {
    generos.value = await GeneroService.getAll();
  } catch (error) {
    console.error(error);
    alert("Error cargando géneros");
  } finally {
    loading.value = false;
  }
};

// --- Acciones del Modal ---
const openCreateModal = () => {
  isEditing.value = false;
  form.value = { id: null, nombre: '' };
  errorMsg.value = '';
  showModal.value = true;
};

const openEditModal = (genero) => {
  isEditing.value = true;
  form.value = { ...genero }; // Copia para no editar directo en la tabla
  errorMsg.value = '';
  showModal.value = true;
};

const saveGenero = async () => {
  if (!form.value.nombre.trim()) {
    errorMsg.value = "El nombre es obligatorio";
    return;
  }

  try {
    if (isEditing.value) {
      await GeneroService.update(form.value.id, { nombre: form.value.nombre });
    } else {
      await GeneroService.create({ nombre: form.value.nombre });
    }
    showModal.value = false;
    loadGeneros(); // Recargar lista
  } catch (error) {
    errorMsg.value = error.response?.data?.error || "Error al guardar";
  }
};

const deleteGenero = async (id) => {
  if(!confirm("¿Estás seguro de eliminar este género?")) return;
  try {
    await GeneroService.delete(id);
    loadGeneros();
  } catch (error) {
    alert("Error al eliminar");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
    <div class="max-w-4xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Géneros</h1>
          <p class="text-gray-400 text-sm mt-1">Categorías para películas y series</p>
        </div>
        
        <div class="flex gap-3">
          <button @click="router.push('/admin')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            👥 Usuarios
          </button>
          <button @click="router.push('/home')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            🏠 Home
          </button>
          <button @click="router.push('/admin/peliculas')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            🎬 Películas
          </button>
        </div>
      </div>

      <div class="mb-6 flex justify-end">
        <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition flex items-center gap-2">
          <span>+</span> Nuevo Género
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-400">Cargando...</div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th class="p-4 w-16">ID</th>
                <th class="p-4">Nombre</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="genero in generos" :key="genero.id" class="hover:bg-gray-700/30 transition">
                <td class="p-4 text-gray-500">#{{ genero.id }}</td>
                <td class="p-4 font-medium text-white">{{ genero.nombre }}</td>
                <td class="p-4 text-right space-x-2">
                  <button @click="openEditModal(genero)" class="text-blue-400 hover:text-blue-300 transition">✏️</button>
                  <button @click="deleteGenero(genero.id)" class="text-red-400 hover:text-red-300 transition">🗑️</button>
                </td>
              </tr>
              <tr v-if="generos.length === 0">
                <td colspan="3" class="p-8 text-center text-gray-500">No hay géneros creados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 animate-fade-in-up">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ isEditing ? 'Editar Género' : 'Nuevo Género' }}
        </h2>
        
        <form @submit.prevent="saveGenero">
          <div class="mb-4">
            <label class="block text-sm text-gray-400 mb-1">Nombre</label>
            <input 
              v-model="form.nombre" 
              placeholder="Ej: Acción, Terror..." 
              class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p v-if="errorMsg" class="text-red-400 text-xs mt-2">{{ errorMsg }}</p>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-300 hover:text-white transition">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
</style>