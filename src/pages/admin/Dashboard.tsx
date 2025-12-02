import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Panel de Control
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleTest}
            disabled={testing}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total de Coches
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                stats.totalCars
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {stats.totalCars === 0
                ? "Sin vehículos en Firebase"
                : "En Firestore"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Estado Firebase
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">
              {db ? "✅" : "❌"}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {db
                ? "Conectado"
                : "Desconectado - Configura variables de entorno en Vercel"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Coches Destacados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">
              {loadingFeatured ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                stats.featuredCars.length
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              Aparecen en el landing page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de Coches Destacados */}
      <Card>
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Gestión de Coches Destacados
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Selecciona qué coches aparecen en la sección destacados del
                landing page (máximo 6 coches)
              </p>
              {isFeaturedLimitReached && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <strong>Límite alcanzado:</strong> Ya tienes 6 coches
                    destacados. Desactiva uno para añadir otro.
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToCars}
              className="text-xs sm:text-sm w-full sm:w-auto"
            >
              <Car className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Ver Todos los Coches
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {loadingFeatured ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : stats.availableCars.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No hay coches disponibles para destacar
            </div>
          ) : (
            <div className="space-y-3">
              {stats.availableCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {car.images && car.images.length > 0 && (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium truncate">
                        {car.make} {car.model}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {car.year} • {car.price.toLocaleString()} €
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={car.featured || false}
                        onCheckedChange={() =>
                          handleToggleFeatured(car.id, car.featured || false)
                        }
                        disabled={!car.featured && isFeaturedLimitReached}
                      />
                      <Label className="text-xs sm:text-sm cursor-pointer">
                        {car.featured ? (
                          <span className="text-yellow-600 font-medium">
                            Destacado
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Normal</span>
                        )}
                      </Label>
                    </div>
                    {!car.featured && isFeaturedLimitReached && (
                      <span className="text-[10px] sm:text-xs text-orange-600 font-medium">
                        (Máx. 6)
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToCarEdit(car.id)}
                      className="text-xs sm:text-sm"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
