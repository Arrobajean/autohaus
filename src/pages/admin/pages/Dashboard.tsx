import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Database, TestTube, Star, Car } from "lucide-react";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const {
    migrating,
    testing,
    loading,
    loadingFeatured,
    stats,
    isFeaturedLimitReached,
    handleTest,
    handleMigrate,
    handleToggleFeatured,
    navigateToCars,
    navigateToCarEdit,
  } = useDashboard();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Panel de Control
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleTest}
            disabled={testing}
            variant="default"
            size="sm"
            className="text-xs sm:text-sm bg-black text-white hover:bg-gray-900"
          >
            {testing ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Probando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <TestTube className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Probar Conexión</span>
                <span className="sm:hidden">Probar</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleMigrate}
            disabled={migrating}
            variant="default"
            size="sm"
            className="text-xs sm:text-sm"
          >
            {migrating ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Migrando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  Migrar Datos a Firebase
                </span>
                <span className="sm:hidden">Migrar</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
              Total de Coches
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-white">
              {loading ? (
                <Skeleton className="h-7 w-16 sm:h-8 sm:w-20 bg-[#2a2a2a]" />
              ) : (
                stats.totalCars
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {loading ? (
                <Skeleton className="h-3 w-32 mt-1 bg-[#2a2a2a]" />
              ) : stats.totalCars === 0 ? (
                "Sin vehículos en Firebase"
              ) : (
                "En Firestore"
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
              Estado Firebase
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-white">
              {db ? "✅" : "❌"}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {db
                ? "Conectado"
                : "Desconectado - Configura variables de entorno en Vercel"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
              Coches Destacados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-white">
              {loadingFeatured ? (
                <Skeleton className="h-7 w-16 sm:h-8 sm:w-20 bg-[#2a2a2a]" />
              ) : (
                stats.featuredCars.length
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {loadingFeatured ? (
                <Skeleton className="h-3 w-32 mt-1 bg-[#2a2a2a]" />
              ) : (
                "Aparecen en el landing page"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
