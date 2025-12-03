import { User } from "firebase/auth";
import { UserProfile } from "@/types";

export const getUserInitials = (user: User | null, userProfile: UserProfile | null): string => {
  // Prioridad: user.displayName (Google) > userProfile.displayName > email
  const displayName = user?.displayName || userProfile?.displayName;
  if (displayName) {
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (user?.email) {
    const emailPrefix = user.email.split('@')[0];
    return emailPrefix.slice(0, 2).toUpperCase();
  }
  return 'U';
};

export const getUserName = (user: User | null, userProfile: UserProfile | null): string => {
  // Prioridad: user.displayName (Google) > userProfile.displayName > email prefix
  return user?.displayName || userProfile?.displayName || user?.email?.split('@')[0] || 'Usuario';
};

export const getUserEmail = (user: User | null): string => {
  return user?.email || '';
};

export const getUserPhotoURL = (user: User | null): string | undefined => {
  // Priorizar photoURL de Firebase Auth (Google) sobre cualquier otra fuente
  return user?.photoURL || undefined;
};

export const getUserRole = (userProfile: UserProfile | null): string | null => {
  return userProfile?.role || null;
};

