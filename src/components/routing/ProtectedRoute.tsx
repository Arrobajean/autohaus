import { Navigate, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Requerir autenticación con Google
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Solo admins (custom claim) entran a /admin/*
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Sin permisos</h1>
        <p className="max-w-md text-sm text-gray-600">
          Esta cuenta no tiene acceso al panel. Pide a un administrador que te
          asigne el claim <code>admin</code> y vuelve a iniciar sesión.
        </p>
        <button
          type="button"
          className="rounded border px-4 py-2 text-sm"
          onClick={async () => {
            if (auth) await signOut(auth);
          }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return <Outlet />;
};
