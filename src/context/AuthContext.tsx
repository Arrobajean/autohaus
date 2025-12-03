import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Auth not initialized");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser && db) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Crear perfil automáticamente si no existe (útil para autenticación con Google)
            const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'editor', // Por defecto editor
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
              createdAt: new Date(),
            };

            try {
              await setDoc(userRef, {
                ...newUserProfile,
                createdAt: serverTimestamp(),
              });
              setUserProfile(newUserProfile);
            } catch (createError) {
              console.error("Error creando perfil de usuario:", createError);
              setUserProfile(null);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
