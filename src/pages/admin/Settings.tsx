import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
          Ajustes de Página
        </h2>
      </div>

      {/* Configuración del Concesionario */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-white text-base sm:text-lg">Configuración del Concesionario</CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm">
            Gestiona la información que se muestra en la página de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <p className="text-xs sm:text-sm text-gray-400">
            Las opciones de configuración del concesionario estarán disponibles próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

