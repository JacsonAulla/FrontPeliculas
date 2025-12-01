<script setup>
import { ref, onMounted } from 'vue';
import AdminService from '../services/AdminService';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado
const users = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

// Cargar usuarios al iniciar
onMounted(() => {
  loadUsers(0);
});

const loadUsers = async (page) => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const data = await AdminService.getAllUsers(page, 5); // 5 usuarios por página
    users.value = data.content;
    currentPage.value = data.number;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
  } catch (error) {
    console.error(error);
    // Si es error 403 (Prohibido), lo sacamos
    if (error.response && error.response.status === 403) {
      alert("No tienes permisos de administrador.");
      router.push('/home');
    } else {
      errorMsg.value = "Error cargando usuarios.";
    }
  } finally {
    loading.value = false;
  }
};

// Acciones
const toggleStatus = async (user) => {
  if(!confirm(`¿Seguro que quieres ${user.estaActivo ? 'bloquear' : 'activar'} a ${user.username}?`)) return;
  
  try {
    const updatedUser = await AdminService.toggleStatus(user.id);
    // Actualizamos solo ese usuario en la lista local (sin recargar todo)
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) users.value[index] = updatedUser;
  } catch (e) {
    alert("Error al cambiar estado");
  }
};

const changeRole = async (user) => {
  const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USUARIO' : 'ROLE_ADMIN';
  if(!confirm(`¿Cambiar rol de ${user.username} a ${newRole}?`)) return;

  try {
    const updatedUser = await AdminService.changeRole(user.id, newRole);
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) users.value[index] = updatedUser;
  } catch (e) {
    alert("Error al cambiar rol");
  }
};

const prevPage = () => {
  if (currentPage.value > 0) loadUsers(currentPage.value - 1);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) loadUsers(currentPage.value + 1);
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
          </div>
        
        <div class="flex gap-3">
          <button @click="router.push('/admin/generos')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            👥 Generos
          </button>
          <button @click="router.push('/home')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            🏠 Home
          </button>
          <button @click="router.push('/admin/peliculas')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            🎬 Películas
          </button>
          <button @click="router.push('/admin/series')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            📺 Series
          </button>
          <button @click="router.push('/admin/canales')" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm">
            📺 Canales
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        
        <div v-if="loading" class="p-8 text-center text-gray-400">Cargando usuarios...</div>
        <div v-else-if="errorMsg" class="p-8 text-center text-red-400">{{ errorMsg }}</div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th class="p-4">Usuario</th>
                <th class="p-4">Rol</th>
                <th class="p-4">Estado</th>
                <th class="p-4">Proveedor</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700/30 transition duration-150">
                
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img :src="user.imagenUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
                         class="h-10 w-10 rounded-full object-cover border border-gray-600" />
                    <div>
                      <p class="font-medium text-white">{{ user.username || 'Sin nombre' }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>

                <td class="p-4">
                  <span :class="`px-2 py-1 rounded text-xs font-bold border ${user.role === 'ROLE_ADMIN' ? 'bg-purple-900/30 text-purple-300 border-purple-700' : 'bg-blue-900/30 text-blue-300 border-blue-700'}`">
                    {{ user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER' }}
                  </span>
                </td>

                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div :class="`h-2.5 w-2.5 rounded-full ${user.estaActivo ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`"></div>
                    <span class="text-sm">{{ user.estaActivo ? 'Activo' : 'Bloqueado' }}</span>
                  </div>
                </td>

                <td class="p-4">
                   <span class="text-sm text-gray-400 flex items-center gap-1">
                      <span v-if="user.provider === 'GOOGLE'">🔵 Google</span>
                      <span v-else>📧 Email</span>
                   </span>
                </td>

                <td class="p-4 text-right space-x-2">
                  <button 
                    @click="changeRole(user)" 
                    title="Cambiar Rol"
                    class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
                  >
                    <span v-if="user.role === 'ROLE_USUARIO'">⬆️</span>
                    <span v-else>⬇️</span>
                  </button>

                  <button 
                    @click="toggleStatus(user)" 
                    :title="user.estaActivo ? 'Bloquear' : 'Activar'"
                    :disabled="user.email === currentUser.email || user.role === 'ROLE_ADMIN'"
                    :class="`p-2 rounded-lg transition text-white 
                    ${(user.email === currentUser.email || user.role === 'ROLE_ADMIN') ? 'opacity-30 cursor-not-allowed bg-gray-600' : ''}
                    ${user.estaActivo && user.email !== currentUser.email ? 'bg-red-600/20 hover:bg-red-600/40 text-red-400' : ''}
                    ${!user.estaActivo ? 'bg-green-600/20 hover:bg-green-600/40 text-green-400' : ''}`"
                  >
                    <span v-if="user.estaActivo">🚫</span>
                    <span v-else>✅</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gray-900/50 p-4 flex items-center justify-between border-t border-gray-700">
          <span class="text-sm text-gray-400">
            Mostrando {{ users.length }} de {{ totalElements }} usuarios
          </span>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 0"
              class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Anterior
            </button>
            <span class="px-2 py-1 text-sm text-gray-400">Pág {{ currentPage + 1 }} de {{ totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="currentPage >= totalPages - 1"
              class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>