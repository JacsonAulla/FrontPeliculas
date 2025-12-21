import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-10 text-white">Verificando permisos...</div>;

    // Si no está logueado o su rol no es ADMIN, lo mandamos al Home o Login
    if (!user || user.rol !== 'ROLE_ADMIN') {
        return <Navigate to="/" replace />;
    }

    // Si es Admin, renderizamos el contenido hijo (Outlet)
    return <Outlet />;
};