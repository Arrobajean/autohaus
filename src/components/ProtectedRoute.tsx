import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // Modo preview: si Firebase no está configurado, permitir acceso
  const isPreviewMode = !auth;

  if (loading && !isPreviewMode) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // En modo preview, permitir acceso sin autenticación
  if (isPreviewMode) {
    return <Outlet />;
  }

  // En modo normal, requerir autenticación
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
