<script setup>
import { ref, onMounted } from 'vue';
import EcommerceService from '../services/EcommerceService';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref({ items: [], total: 0 });
const loading = ref(true);
const processing = ref(false); // Para el botón de pagar

onMounted(() => loadCart());

const loadCart = async () => {
  loading.value = true;
  try {
    cart.value = await EcommerceService.getCart();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const removeItem = async (itemId) => {
  if(!confirm("¿Quitar del carrito?")) return;
  try {
    await EcommerceService.removeFromCart(itemId);
    loadCart(); // Recargar
  } catch (error) {
    alert("Error al eliminar");
  }
};

const checkout = async () => {
  if(!confirm(`¿Confirmar compra por $${cart.value.total}?`)) return;
  
  processing.value = true;
  try {
    await EcommerceService.checkout();
    alert("¡Compra realizada con éxito! Disfruta tu contenido.");
    router.push('/home'); // O a "Mi Biblioteca" si existiera
  } catch (error) {
    alert(error.response?.data?.error || "Error en el pago");
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    <div class="max-w-4xl mx-auto">
      
      <div class="flex items-center justify-between mb-8 pt-4">
        <h1 class="text-3xl font-bold text-white">Tu Carrito</h1>
        <button @click="router.back()" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">Seguir viendo</button>
      </div>

      <div v-if="loading" class="text-center py-10">Cargando...</div>

      <div v-else-if="cart.items.length === 0" class="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
        <p class="text-xl text-gray-400 mb-4">El carrito está vacío 🛒</p>
        <button @click="router.push('/home')" class="text-blue-400 hover:underline">Ir a buscar películas</button>
      </div>

      <div v-else class="flex flex-col md:flex-row gap-8">
        
        <div class="flex-1 space-y-4">
          <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
            <img :src="item.imgPortada" class="w-16 h-24 object-cover rounded shadow" />
            <div class="flex-1">
              <h3 class="font-bold text-lg">{{ item.titulo }}</h3>
              <p class="text-sm text-gray-400">Película</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-xl">${{ item.precio }}</p>
              <button @click="removeItem(item.id)" class="text-xs text-red-400 hover:text-red-300 mt-1">Eliminar</button>
            </div>
          </div>
        </div>

        <div class="w-full md:w-80 h-fit bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg sticky top-24">
          <h3 class="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Resumen</h3>
          
          <div class="flex justify-between mb-2 text-gray-400">
            <span>Cantidad</span>
            <span>{{ cart.items.length }} items</span>
          </div>
          <div class="flex justify-between text-2xl font-bold text-white mb-6">
            <span>Total</span>
            <span>${{ cart.total }}</span>
          </div>

          <button 
            @click="checkout" 
            :disabled="processing"
            class="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
          >
            <span v-if="!processing">Pagar Ahora</span>
            <span v-else class="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>