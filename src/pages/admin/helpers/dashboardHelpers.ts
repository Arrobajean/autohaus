import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";

const MAX_FEATURED_CARS = 12;

/**
 * Obtiene todas las estadísticas del dashboard
 */
export const fetchDashboardStats = async () => {
  if (!db) {
    throw new Error("Firebase no está configurado");
  }

  const carsSnapshot = await getDocs(collection(db, "cars"));
  const totalCars = carsSnapshot.size;

  const carsData = carsSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Car)
  );

  const featuredCars = carsData.filter((car) => car.featured === true);
  const availableCars = carsData.filter((car) => car.status === "available");

  return {
    totalCars,
    allCars: carsData,
    featuredCars,
    availableCars,
  };
};

/**
 * Actualiza el estado de destacado de un coche
 */
export const updateCarFeaturedStatus = async (
  carId: string,
  featured: boolean
) => {
  if (!db) {
    throw new Error("Firebase no está configurado");
  }

  const carRef = doc(db, "cars", carId);
  await updateDoc(carRef, {
    featured,
    updatedAt: new Date(),
  });
};

/**
 * Valida si se puede añadir un coche destacado
 */
export const canAddFeaturedCar = (currentFeaturedCount: number): boolean => {
  return currentFeaturedCount < MAX_FEATURED_CARS;
};

/**
 * Obtiene el límite máximo de coches destacados
 */
export const getMaxFeaturedCars = (): number => {
  return MAX_FEATURED_CARS;
};

