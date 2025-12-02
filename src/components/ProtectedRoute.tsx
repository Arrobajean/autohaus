import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // MODO PREVIEW: Permitir acceso sin autenticación
  // Cambiar a false cuando quieras activar autenticación real
  const PREVIEW_MODE = true;

  if (loading && !PREVIEW_MODE) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // En modo preview, permitir acceso sin autenticación
  if (PREVIEW_MODE) {
    return <Outlet />;
  }

  // En modo normal (con Firebase real), requerir autenticación
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
