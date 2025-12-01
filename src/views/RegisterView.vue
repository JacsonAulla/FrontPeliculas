<script setup>
import { ref } from 'vue';
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { GoogleLogin } from 'vue3-google-login';

const router = useRouter();

// Estado del proceso (1: Datos, 2: Código, 3: Password, 4: Completar Google)
const step = ref(1);
const loading = ref(false);
const mensaje = ref('');
const esError = ref(false);

// Datos del formulario
const form = ref({
  email: '',
  username: '',
  fechaNacimiento: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
});

// --- PASO 1: INICIAR REGISTRO TRADICIONAL ---
const handleStep1 = async () => {
  loading.value = true;
  mensaje.value = '';
  try {
    await AuthService.registerInit({
      email: form.value.email,
      username: form.value.username,
      fechaNacimiento: form.value.fechaNacimiento
    });
    step.value = 2;
    mensaje.value = '¡Código enviado! Revisa tu correo.';
    esError.value = false;
  } catch (error) {
    mostrarError(error);
  } finally {
    loading.value = false;
  }
};

// --- PASO 2: VERIFICAR CÓDIGO ---
const handleStep2 = async () => {
  loading.value = true;
  try {
    await AuthService.verifyCode(form.value.email, form.value.verificationCode);
    step.value = 3;
    mensaje.value = 'Código correcto. Crea tu contraseña.';
    esError.value = false;
  } catch (error) {
    mostrarError(error);
  } finally {
    loading.value = false;
  }
};

// --- PASO 3: CREAR CONTRASEÑA ---
const handleStep3 = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    mostrarError({ response: { data: { error: 'Las contraseñas no coinciden' } } });
    return;
  }
  loading.value = true;
  try {
    await AuthService.setPassword(form.value.email, form.value.password);
    alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
    router.push('/'); 
  } catch (error) {
    mostrarError(error);
  } finally {
    loading.value = false;
  }
};

// --- OPCIÓN GOOGLE: REGISTRO RÁPIDO ---
const callbackGoogle = async (response) => {
  try {
    const data = await AuthService.loginWithGoogle(response.credential);
    
    if (data.registroCompleto) {
      localStorage.setItem('token', data.token);
      alert('Ya tenías cuenta. ¡Iniciando sesión!');
      router.push('/');
    } else {
      form.value.email = data.email;
      step.value = 4; 
      mensaje.value = "¡Cuenta creada con Google! Solo faltan unos detalles.";
      esError.value = false;
    }
  } catch (error) {
    mostrarError({ response: { data: { error: 'Error al registrarse con Google' } } });
  }
};

// --- PASO 4: COMPLETAR REGISTRO GOOGLE ---
const handleStep4 = async () => {
  loading.value = true;
  try {
    const payload = {
      email: form.value.email,
      username: form.value.username,
      fechaNacimiento: form.value.fechaNacimiento,
      password: form.value.password 
    };
    
    const response = await axios.post('http://localhost:8080/auth/complete-google', payload);
    
    localStorage.setItem('token', response.data.token);
    alert('¡Registro completado! Bienvenido.');
    router.push('/home');
    
  } catch (error) {
    mostrarError(error);
  } finally {
    loading.value = false;
  }
};

const mostrarError = (error) => {
  esError.value = true;
  mensaje.value = error.response?.data?.error || 'Ocurrió un error';
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[url('/fondoPeliculas.jpg')] bg-cover bg-center bg-no-repeat bg-gray-900/70 bg-blend-overlay font-sans">

    <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border border-gray-700/50 relative">
      
      <h1 class="text-3xl font-bold mb-6 text-center text-white tracking-tight">Crear Cuenta</h1>
      
      <div v-if="step <= 3" class="flex justify-center items-center mb-8 space-x-4">
        <div class="flex flex-col items-center">
            <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 1 ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800' : 'bg-gray-600 text-gray-400'}`">1</div>
        </div>
        <div :class="`h-1 w-8 rounded transition-all duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-600'}`"></div>
        
        <div class="flex flex-col items-center">
            <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 2 ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800' : 'bg-gray-600 text-gray-400'}`">2</div>
        </div>
        <div :class="`h-1 w-8 rounded transition-all duration-300 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-600'}`"></div>

        <div class="flex flex-col items-center">
            <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 3 ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800' : 'bg-gray-600 text-gray-400'}`">3</div>
        </div>
      </div>

      <div v-if="step === 1" class="animate-fade-in-up">
        <form @submit.prevent="handleStep1" class="flex flex-col space-y-5">
          <h3 class="text-xl text-gray-200 font-semibold text-center">Datos Personales</h3>
          
          <input v-model="form.username" placeholder="Nombre de usuario" required class="input-dark" />
          <input v-model="form.email" type="email" placeholder="Correo electrónico" required class="input-dark" />
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1 ml-1">Fecha de Nacimiento</label>
            <input v-model="form.fechaNacimiento" type="date" required class="input-dark text-gray-400" />
          </div>
          
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Enviando...' : 'Siguiente' }}
          </button>
        </form>

        <div class="relative my-8">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-600"></div></div>
            <div class="relative flex justify-center text-sm"><span class="px-2 bg-gray-800 text-gray-400">O regístrate con</span></div>
        </div>
        
        <div class="flex justify-center">
          <GoogleLogin :callback="callbackGoogle" />
        </div>
      </div>

      <div v-if="step === 2" class="animate-fade-in-up">
        <form @submit.prevent="handleStep2" class="flex flex-col space-y-5 text-center">
          <h3 class="text-xl text-gray-200 font-semibold">Verificar Correo</h3>
          <p class="text-gray-400 text-sm">Código enviado a <span class="text-white font-bold">{{ form.email }}</span></p>
          
          <input v-model="form.verificationCode" placeholder="Código (ej: A1B2C3)" required class="input-dark text-center tracking-widest text-lg uppercase" maxlength="6"/>
          
          <button type="submit" :disabled="loading" class="btn-primary">Verificar</button>
          <button type="button" @click="step = 1" class="text-gray-400 hover:text-white text-sm underline transition">Volver / Corregir correo</button>
        </form>
      </div>

      <div v-if="step === 3" class="animate-fade-in-up">
        <form @submit.prevent="handleStep3" class="flex flex-col space-y-5">
          <h3 class="text-xl text-gray-200 font-semibold text-center">Seguridad</h3>
          <input v-model="form.password" type="password" placeholder="Contraseña" required minlength="6" class="input-dark"/>
          <input v-model="form.confirmPassword" type="password" placeholder="Confirmar contraseña" required class="input-dark"/>
          <button type="submit" :disabled="loading" class="btn-success">Finalizar Registro</button>
        </form>
      </div>

      <div v-if="step === 4" class="animate-fade-in-up">
        <form @submit.prevent="handleStep4" class="flex flex-col space-y-5">
          <div class="text-center mb-2">
            <h3 class="text-xl text-white font-bold">¡Casi listos!</h3>
            <p class="text-sm text-gray-400">{{ form.email }}</p>
          </div>
          
          <input v-model="form.username" placeholder="Elige un nombre de usuario" required class="input-dark" />
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1 ml-1">Fecha de Nacimiento</label>
            <input v-model="form.fechaNacimiento" type="date" required class="input-dark text-gray-400" />
          </div>
          <input v-model="form.password" type="password" placeholder="Crea una contraseña (Opcional)" required class="input-dark"/>
          
          <button type="submit" :disabled="loading" class="btn-success">Completar Registro</button>
        </form>
      </div>

      <div v-if="step === 1" class="mt-6 text-center text-sm text-gray-400">
        ¿Ya tienes cuenta? 
        <router-link to="/" class="text-blue-400 hover:text-blue-300 hover:underline transition duration-200 font-medium">Inicia Sesión</router-link>
      </div>

    </div>

    <div v-if="mensaje" class="absolute bottom-10 px-4 w-full max-w-md">
        <div :class="`p-4 rounded-lg text-center text-sm font-medium shadow-lg backdrop-blur-md border transition-all duration-500 ${esError ? 'bg-red-900/80 text-red-200 border-red-800' : 'bg-green-900/80 text-green-200 border-green-800'}`">
            {{ mensaje }}
        </div>
    </div>

  </div>
</template>

<style scoped>
/* Clases reutilizables con @apply de Tailwind para limpiar el HTML */
.input-dark {
    @apply w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200;
}
.btn-primary {
    @apply w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-success {
    @apply w-full px-4 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Pequeña animación de entrada para suavizar cambios de paso */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out;
}

/* Arreglo para icono calendario blanco */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.6;
    cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}
</style>