import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { migrateCarsToFirebase } from "@/lib/migrateDataToFirebase";
import { testFirebaseConnection } from "@/lib/testFirebaseConnection";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import {
  fetchDashboardStats,
  updateCarFeaturedStatus,
  canAddFeaturedCar,
  getMaxFeaturedCars,
} from "@/pages/admin/helpers/dashboardHelpers";

interface DashboardStats {
  totalCars: number;
  allCars: Car[];
  featuredCars: Car[];
  availableCars: Car[];
}

export const useDashboard = () => {
  const navigate = useNavigate();
  const [migrating, setMigrating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    allCars: [],
    featuredCars: [],
    availableCars: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const loadStats = useCallback(async () => {
    if (!db) {
      setLoading(false);
      setLoadingFeatured(false);
      return;
    }

    try {
      const dashboardStats = await fetchDashboardStats();
      setStats(dashboardStats);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error(
        "Error al conectar con Firebase: " +
          (error.message || "Verifica las variables de entorno en Vercel")
      );
    } finally {
      setLoading(false);
      setLoadingFeatured(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleTest = useCallback(async () => {
    setTesting(true);
    try {
      const result = await testFirebaseConnection();
      if (result.success) {
        toast.success(result.message);
        // Refrescar solo el total de coches
        if (db) {
          const { totalCars } = await fetchDashboardStats();
          setStats((prev) => ({ ...prev, totalCars }));
        }
      } else {
        toast.error(result.message);
      }
    } finally {
      setTesting(false);
    }
  }, []);

  const handleMigrate = useCallback(async () => {
    setMigrating(true);
    try {
      const result = await migrateCarsToFirebase(false);
      if (result.success) {
        toast.success(result.message);
        // Recargar stats completas
        await loadStats();
      } else {
        if (result.message.includes("Ya existen")) {
          const forceMigrate = window.confirm(
            `${result.message}\n\n¿Deseas migrar de todos modos? (Esto añadirá los datos sin eliminar los existentes)`
          );
          if (forceMigrate) {
            const forceResult = await migrateCarsToFirebase(true);
            if (forceResult.success) {
              toast.success(forceResult.message);
              await loadStats();
            } else {
              toast.error(forceResult.message);
            }
          }
        } else {
          toast.error(result.message);
        }
      }
    } finally {
      setMigrating(false);
    }
  }, [loadStats]);

  const handleToggleFeatured = useCallback(
    async (carId: string, currentFeatured: boolean) => {
      // Validar límite antes de activar
      if (!currentFeatured && !canAddFeaturedCar(stats.featuredCars.length)) {
        toast.error(
          "Ya hay 12 coches destacados. Desactiva uno primero para añadir otro.",
          {
            duration: 4000,
          }
        );
        return;
      }

      try {
        await updateCarFeaturedStatus(carId, !currentFeatured);

        // Actualizar estado local
        setStats((prev) => {
          const updatedAllCars = prev.allCars.map((car) =>
            car.id === carId ? { ...car, featured: !currentFeatured } : car
          );

          const updatedFeaturedCars = currentFeatured
            ? prev.featuredCars.filter((car) => car.id !== carId)
            : [
                ...prev.featuredCars,
                updatedAllCars.find((c) => c.id === carId)!,
              ];

          const updatedAvailableCars = updatedAllCars.filter(
            (car) => car.status === "available"
          );

          return {
            ...prev,
            allCars: updatedAllCars,
            featuredCars: updatedFeaturedCars,
            availableCars: updatedAvailableCars,
          };
        });

        toast.success(
          currentFeatured
            ? "Coche removido de destacados"
            : "Coche añadido a destacados"
        );
      } catch (error: any) {
        console.error("Error updating featured status:", error);
        toast.error("Error al actualizar: " + error.message);
      }
    },
    [stats.featuredCars.length]
  );

  const navigateToCars = useCallback(() => {
    navigate("/admin/cars");
  }, [navigate]);

  const navigateToCarEdit = useCallback(
    (carId: string) => {
      navigate(`/admin/cars/${carId}`);
    },
    [navigate]
  );

  return {
    // Estado
    migrating,
    testing,
    loading,
    loadingFeatured,
    stats,
    maxFeaturedCars: getMaxFeaturedCars(),
    isFeaturedLimitReached: stats.featuredCars.length >= getMaxFeaturedCars(),

    // Acciones
    handleTest,
    handleMigrate,
    handleToggleFeatured,
    navigateToCars,
    navigateToCarEdit,
    refreshStats: loadStats,
  };
};

