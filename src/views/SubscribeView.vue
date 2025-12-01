<script setup>
import { ref, onMounted } from 'vue';
import EcommerceService from '../services/EcommerceService';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentPlan = ref(null);

// Planes "Hardcoded" (Deben coincidir con IDs de BD)
const plans = [
    { id: 1, name: 'Mensual', price: 9.99, days: 30, features: ['Acceso ilimitado', 'Sin anuncios', 'Cancela cuando quieras'] },
    { id: 2, name: 'Anual', price: 99.99, days: 365, features: ['Ahorras 2 meses', 'Acceso ilimitado', '4K Disponible'] }
];

onMounted(async () => {
    try {
        const status = await EcommerceService.getSubscriptionStatus();
        if(status.activa) currentPlan.value = status.nombrePlan;
    } catch(e) {}
});

const subscribe = async (plan) => {
    if(!confirm(`¿Suscribirse al plan ${plan.name} por $${plan.price}?`)) return;
    try {
        await EcommerceService.subscribe(plan.id);
        alert(`¡Bienvenido al plan ${plan.name}!`);
        router.push('/home');
    } catch (error) {
        alert("Error al procesar el pago");
    }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-6">
    <div class="max-w-5xl w-full">
      
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Elige tu Plan</h1>
        <p class="text-gray-400">Disfruta de todo el contenido sin límites.</p>
        <button @click="router.back()" class="mt-4 text-sm text-gray-500 hover:text-white underline">Volver al Home</button>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div v-for="plan in plans" :key="plan.id" 
             :class="`bg-gray-800 rounded-2xl p-8 border-2 transition hover:scale-105 ${currentPlan === plan.name ? 'border-green-500 shadow-green-900/20 shadow-2xl' : 'border-gray-700 hover:border-blue-500'}`">
            
            <div v-if="currentPlan === plan.name" class="text-green-400 font-bold text-sm uppercase mb-2 tracking-wide">Tu Plan Actual</div>
            
            <h3 class="text-2xl font-bold">{{ plan.name }}</h3>
            <div class="my-4">
                <span class="text-4xl font-extrabold">${{ plan.price }}</span>
                <span class="text-gray-400"> / {{ plan.id === 1 ? 'mes' : 'año' }}</span>
            </div>

            <ul class="space-y-3 mb-8 text-gray-300">
                <li v-for="f in plan.features" :key="f" class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    {{ f }}
                </li>
            </ul>

            <button 
                @click="subscribe(plan)"
                :disabled="currentPlan"
                :class="`w-full py-3 rounded-xl font-bold transition ${currentPlan ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`"
            >
                {{ currentPlan === plan.name ? 'Activo' : 'Suscribirse' }}
            </button>
        </div>
      </div>

    </div>
  </div>
</template>