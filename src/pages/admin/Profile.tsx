import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Save, User, Mail, Key } from "lucide-react";

const Profile = () => {
  const { user, userProfile } = useAuth();

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  const getUserInitials = () => {
    // Prioridad: userProfile.displayName > user.displayName > email
    const displayName = userProfile?.displayName || user?.displayName;
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      // Si no hay displayName, usar las primeras dos letras del email
      const emailPrefix = user.email.split("@")[0];
      return emailPrefix.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    // Prioridad: userProfile.displayName > user.displayName > email prefix
    return (
      userProfile?.displayName ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Usuario"
    );
  };

  const getUserPhotoURL = () => {
    // Usar photoURL de Firebase Auth si está disponible
    return user?.photoURL || undefined;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
          Mi Perfil
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Perfil de Usuario */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Avatar y Información */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={getUserPhotoURL()} />
                <AvatarFallback className="bg-[#2a2a2a] text-white text-lg sm:text-xl font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-white truncate">
                  {getUserName()}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {user?.email}
                </p>
                {userProfile?.role && (
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                      userProfile.role === "admin"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {userProfile.role === "admin" ? "Administrador" : "Editor"}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-[#2a2a2a]" />
            <div className="space-y-3">
              <div className="space-y-2">
                <Label
                  htmlFor="displayName"
                  className="text-gray-200 text-xs sm:text-sm"
                >
                  Nombre de Usuario
                </Label>
                <Input
                  id="displayName"
                  defaultValue={userProfile?.displayName || ""}
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 text-sm"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-200 flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-gray-400 text-sm"
                />
                <p className="text-xs text-gray-500">
                  El correo no se puede cambiar
                </p>
              </div>
              <Button
                onClick={handleSave}
                className="w-full text-xs sm:text-sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <Key className="w-4 h-4 sm:w-5 sm:h-5" />
              Seguridad
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Cambiar contraseña y configuración de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-gray-200 text-xs sm:text-sm"
                >
                  Contraseña Actual
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-200 text-xs sm:text-sm"
                >
                  Nueva Contraseña
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-200 text-xs sm:text-sm"
                >
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <Button
                onClick={handleSave}
                variant="default"
                className="w-full bg-black text-white hover:bg-gray-900 text-xs sm:text-sm"
              >
                <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
