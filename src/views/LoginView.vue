<script setup>
import { ref } from 'vue';
import AuthService from '../services/AuthService';
import axios from 'axios';
import { GoogleLogin } from 'vue3-google-login';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos
const identifier = ref('');
const password = ref('');
const googleEmail = ref('');
const newUsername = ref('');
const newBirthdate = ref('');
const newPassword = ref('');

// Estado
const mensaje = ref('');
const esError = ref(false);
const showCompleteProfile = ref(false);

// --- 1. Login Tradicional ---
const handleLogin = async () => {
  try {
    const data = await AuthService.login(identifier.value, password.value);
    finalizarLogin(data);
  } catch (error) {
    mostrarError(error.response?.data?.error || 'Error al iniciar sesión');
  }
};

// --- 2. Login Google ---
const callbackGoogle = async (response) => {
  try {
    const data = await AuthService.loginWithGoogle(response.credential);
    
    if (data.registroCompleto) {
      finalizarLogin(data);
    } else {
      googleEmail.value = data.email;
      showCompleteProfile.value = true;
      mensaje.value = "¡Casi listo! Completa tus datos.";
      esError.value = false;
    }
  } catch (error) {
    mostrarError('Error en Google Login');
  }
};

// --- 3. Completar Perfil ---
const handleCompleteProfile = async () => {
  try {
    const payload = {
      email: googleEmail.value,
      username: newUsername.value,
      fechaNacimiento: newBirthdate.value,
      password: newPassword.value
    };
    const response = await axios.post('http://localhost:8080/auth/complete-google', payload);
    finalizarLogin(response.data);
  } catch (error) {
    mostrarError(error.response?.data?.error || 'Error al completar perfil');
  }
};

// Auxiliares
const finalizarLogin = (data) => {
  localStorage.setItem('token', data.token);
  // Guardamos datos del usuario en localStorage por conveniencia (opcional)
  localStorage.setItem('user', JSON.stringify({
      username: data.username,
      email: data.email,
      role: data.role,
      photo: data.imagenUrl
  }));
  
  mensaje.value = `¡Bienvenido ${data.username || data.email}!`;
  esError.value = false;
  showCompleteProfile.value = false;
  
  // Redirección al home
  setTimeout(() => router.push('/home'), 1500);
};

const mostrarError = (msg) => {
  esError.value = true;
  mensaje.value = msg;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[url('/fondoPeliculas.jpg')] bg-cover bg-center bg-no-repeat bg-gray-900/70 bg-blend-overlay font-sans">

    <div v-if="!showCompleteProfile" class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border border-gray-700/50">
      <h2 class="text-3xl font-bold mb-8 text-center text-white tracking-tight">Iniciar Sesión</h2>

      <form @submit.prevent="handleLogin" class="flex flex-col space-y-5">
        <div>
          <label class="sr-only">Email o Usuario</label>
          <input
            v-model="identifier"
            placeholder="Email o Usuario"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
        <div>
           <label class="sr-only">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="Contraseña"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-3 mt-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
        >
          Entrar
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-400">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300 hover:underline transition duration-200 font-medium">
          Regístrate aquí
        </router-link>
      </div>

      <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-800 text-gray-400">O entra con</span>
          </div>
      </div>

      <div class="flex justify-center">
        <GoogleLogin :callback="callbackGoogle" />
      </div>
    </div>

    <div v-else class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700/50">
      <h2 class="text-2xl font-bold mb-2 text-center text-white">¡Bienvenido!</h2>
      <p class="text-center text-gray-400 mb-8 text-sm">{{ googleEmail }}</p>
      <p class="text-gray-300 mb-6 text-center">Termina tu registro para continuar</p>

      <form @submit.prevent="handleCompleteProfile" class="flex flex-col space-y-5">
        <input
          v-model="newUsername"
          placeholder="Elige un nombre de usuario"
          required
          class="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
        <div>
            <label class="block text-sm font-medium text-gray-300 mb-2 ml-1">Fecha de Nacimiento</label>
            <input
            v-model="newBirthdate"
            type="date"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
        </div>

        <input
          v-model="newPassword"
          type="password"
          placeholder="Crea una contraseña (opcional)"
          required
          class="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />

        <div class="flex flex-col space-y-3 mt-4">
            <button
            type="submit"
            class="w-full px-4 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-gray-800 transition duration-200"
            >
            Completar Registro
            </button>
            <button
            type="button"
            @click="showCompleteProfile = false"
            class="w-full px-4 py-3 font-bold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none transition duration-200 border border-gray-600"
            >
            Cancelar
            </button>
        </div>
      </form>
    </div>

    <div v-if="mensaje" class="absolute bottom-10 px-4 w-full max-w-md">
        <div :class="`p-4 rounded-lg text-center text-sm font-medium shadow-lg backdrop-blur-md border transition-all duration-500 ${esError ? 'bg-red-900/80 text-red-200 border-red-800' : 'bg-green-900/80 text-green-200 border-green-800'}`">
            {{ mensaje }}
        </div>
    </div>

  </div>
</template>

<style scoped>
/* ESTO ES VITAL PARA EL MODO OSCURO */
/* Invierte el color del icono del calendario a blanco */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.7;
    cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}
</style>