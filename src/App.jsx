import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas de Usuario
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { PeliculaPage } from './pages/PeliculaPage';
import { CanalPage } from './pages/CanalPage';
import { SeriePage } from './pages/SeriePage';

// Componentes de Admin (NUEVOS)
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminPeliculas } from './pages/admin/AdminPeliculas';
import { PeliculaForm } from './pages/admin/PeliculaForm';
import { AdminSeries } from './pages/admin/AdminSeries';
import { SerieForm } from './pages/admin/SerieForm';
import { AdminSerieDetalle } from './pages/admin/AdminSerieDetalle';
import { AdminCanales } from './pages/admin/AdminCanales';
import { CanalForm } from './pages/admin/CanalForm';
import { AdminGeneros } from './pages/admin/AdminGeneros';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { UsuarioForm } from './pages/admin/UsuarioForm';

import { AdminDashboard } from './pages/admin/AdminDashboard';
// Contexto
import { useAuth } from './context/AuthContext';

// Componente para proteger rutas de USUARIO (Login requerido)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-weseco-950 flex items-center justify-center text-white">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      {/* =========================================
          ZONA PÚBLICA (Solo Login)
      ========================================= */}
      <Route path="/login" element={<LoginPage />} />

      {/* =========================================
          ZONA USUARIO (Requiere estar logueado)
      ========================================= */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Detalles y Reproducción */}
      <Route path="/peliculas/:slug" element={<ProtectedRoute><PeliculaPage /></ProtectedRoute>} />
      <Route path="/series/:slug" element={<ProtectedRoute><SeriePage /></ProtectedRoute>} />
      <Route path="/canales/:slug" element={<ProtectedRoute><CanalPage /></ProtectedRoute>} />

      {/* =========================================
          ZONA ADMIN (Requiere Rol ADMIN)
      ========================================= */}
      {/* 1. Primero verificamos si es Admin (AdminRoute) */}
      <Route path="/admin" element={<AdminRoute />}>

        {/* 2. Si pasa, mostramos el Layout con Sidebar (AdminLayout) */}
        <Route element={<AdminLayout />}>

          {/* CRUD Películas */}
          <Route path="peliculas" element={<AdminPeliculas />} />
          <Route path="peliculas/nuevo" element={<PeliculaForm />} />
          <Route path="peliculas/editar/:id" element={<PeliculaForm />} />

          {/* ... rutas de series ... */}
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/nuevo" element={<SerieForm />} />
          <Route path="series/editar/:id" element={<SerieForm />} />

          {/* AGREGA ESTA LÍNEA PENDIENTE: */}
          <Route path="series/:id/contenido" element={<AdminSerieDetalle />} />

          <Route path="canales" element={<AdminCanales />} />
          <Route path="canales/nuevo" element={<CanalForm />} />
          <Route path="canales/editar/:id" element={<CanalForm />} />

          {/* CRUD Generos */}
          <Route path="generos" element={<AdminGeneros />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Gestión de Usuarios */}
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        </Route>
      </Route>

      {/* =========================================
          Ruta por defecto (404 -> Home)
      ========================================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;