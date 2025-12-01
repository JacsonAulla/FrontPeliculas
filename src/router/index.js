import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue' // Asegúrate de que este archivo exista
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import AdminGenerosView from '../views/AdminGenerosView.vue'
import AdminPeliculasView from '../views/AdminPeliculasView.vue'
import PublicPeliculasView from '../views/PublicPeliculasView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import PlayerView from '../views/PlayerView.vue'
import AdminSeriesView from '../views/AdminSeriesView.vue'
import SerieDetailView from '../views/SerieDetailView.vue'
import AdminEpisodiosView from '../views/AdminEpisodiosView.vue'
import AdminCanalesView from '../views/AdminCanalesView.vue'
import PublicSeriesView from '../views/PublicSeriesView.vue'
import PublicCanalesView from '../views/PublicCanalesView.vue'
import CartView from '../views/CartView.vue'
import LibraryView from '../views/LibraryView.vue'
import SubscribeView from '../views/SubscribeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',      // La raíz
      name: 'login',  // Nombre de la ruta
      component: LoginView,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Requiere autenticación
    },
    {
      path: '/admin',
      name: 'admin-users',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true } // Requiere autenticación
    },
    {
      path: '/admin/generos',
      name: 'admin-generos',
      component: AdminGenerosView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/peliculas',
      name: 'admin-peliculas',
      component: AdminPeliculasView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/peliculas',
      name: 'public-peliculas',
      component: PublicPeliculasView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ver/:id',
      name: 'movie-detail',
      component: MovieDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/player/:id',
      name: 'player',
      component: PlayerView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/series',
      name: 'admin-series',
      component: AdminSeriesView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/ver/serie/:id',
      name: 'serie-detail',
      component: SerieDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/series/:id/episodios',
      name: 'admin-episodios',
      component: AdminEpisodiosView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/canales',
      name: 'admin-canales',
      component: AdminCanalesView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/series',
      name: 'public-series',
      component: PublicSeriesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/canales',
      name: 'public-canales',
      component: PublicCanalesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/carrito',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true }
    },
    { path: '/biblioteca', name: 'library', component: LibraryView, meta: { requiresAuth: true } },
    { path: '/planes', name: 'plans', component: SubscribeView, meta: { requiresAuth: true } },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 3. EL GUARDIA DE NAVEGACIÓN (Navigation Guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let userRole = null;

  if (userStr) {
    try {
      userRole = JSON.parse(userStr).role; // Leemos el rol guardado
    } catch (e) {
      console.error("Error leyendo usuario", e);
    }
  }

  // Lógica de Auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'login' });
      return;
    }

    // Lógica de Admin (NUEVO)
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (userRole !== 'ROLE_ADMIN') {
        alert("Acceso Denegado: Se requieren permisos de Administrador.");
        next({ name: 'home' }); // Lo devolvemos al home
        return;
      }
    }
  }

  if (to.matched.some(record => record.meta.guest) && token) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router