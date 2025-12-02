import { Car } from "@/types";

/**
 * Encuentra coches similares basándose en categoría y características
 * @param currentCar - El coche actual
 * @param allCars - Todos los coches disponibles
 * @param limit - Número máximo de coches similares a devolver
 * @returns Array de coches similares
 */
export const findSimilarCars = (
  currentCar: Car,
  allCars: Car[],
  limit: number = 3
): Car[] => {
  return allCars
    .filter((car) => car.id !== currentCar.id)
    .map((car) => {
      let score = 0;

      // Misma categoría: +3 puntos
      if (car.category === currentCar.category) {
        score += 3;
      }

      // Precio similar (±20%): +2 puntos
      const priceRatio = car.price / currentCar.price;
      if (priceRatio >= 0.8 && priceRatio <= 1.2) {
        score += 2;
      }

      // Misma marca: +1 punto
      if (car.make === currentCar.make) {
        score += 1;
      }

      // Mismo tipo de combustible: +1 punto
      if (car.fuelType === currentCar.fuelType) {
        score += 1;
      }

      // Mismo drivetrain: +1 punto
      if (car.drivetrain === currentCar.drivetrain) {
        score += 1;
      }

      return { car, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.car);
};

