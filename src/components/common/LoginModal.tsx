import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const LoginModal = ({ open, onOpenChange, onSuccess }: LoginModalProps) => {
  const [loading, setLoading] = useState(false);

  const createUserProfile = async (user: any) => {
    if (!db) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Crear perfil de usuario si no existe
        const userProfile = {
          uid: user.uid,
          email: user.email || '',
          role: 'editor' as const, // Por defecto editor, el admin puede cambiarlo después
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
          createdAt: serverTimestamp(),
        };

        await setDoc(userRef, userProfile);
      }
    } catch (error: any) {
      console.error('Error creando perfil de usuario:', error);
      // No mostramos error al usuario porque la autenticación fue exitosa
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Firebase no está configurado. Por favor, verifica tu archivo .env");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
      toast.success('Inicio de sesión exitoso');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(error);
      
      // Errores específicos de Google
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Ventana de autenticación cerrada');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Ventana emergente bloqueada. Por favor, permite ventanas emergentes para este sitio');
      } else {
        toast.error('Error al iniciar sesión con Google: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">¡Bienvenido!</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-700">
              Accede al panel de administración
            </p>
            <p className="text-sm text-gray-500">
              Inicia sesión con tu cuenta de Google para continuar
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

