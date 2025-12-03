import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const MAX_FEATURED_CARS = 6;

export const validateFeaturedLimit = async (
  carId: string | undefined,
  isTryingToFeature: boolean,
  wasAlreadyFeatured: boolean
): Promise<boolean> => {
  if (!isTryingToFeature || wasAlreadyFeatured) {
    return true;
  }

  if (!db) {
    toast.error("Firebase no está configurado.");
    return false;
  }

  try {
    // Contar coches destacados actuales
    try {
      const featuredQuery = query(
        collection(db, "cars"),
        where("featured", "==", true)
      );
      const featuredSnapshot = await getDocs(featuredQuery);
      const featuredCount = featuredSnapshot.docs.filter(
        (doc) => (carId ? doc.id !== carId : true) // Excluir el coche actual si es edición
      ).length;

      if (featuredCount >= MAX_FEATURED_CARS) {
        toast.error(
          "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
          { duration: 4000 }
        );
        return false;
      }
    } catch (queryError: any) {
      // Si la consulta falla (por ejemplo, falta índice), intentar contar manualmente
      console.warn(
        "Error en consulta de destacados, contando manualmente:",
        queryError
      );
      const allCarsSnapshot = await getDocs(collection(db, "cars"));
      const featuredCount = allCarsSnapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.featured === true && (carId ? doc.id !== carId : true);
      }).length;

      if (featuredCount >= MAX_FEATURED_CARS) {
        toast.error(
          "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
          { duration: 4000 }
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error validating featured limit:", error);
    toast.error("Error al validar el límite de coches destacados");
    return false;
  }
};

