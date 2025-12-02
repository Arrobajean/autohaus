import { Car } from "@/types";
import { CARS_DATA } from "./carsData";

/**
 * Funciones helper para trabajar con los datos de coches
 * Separadas de los datos para mantener responsabilidades claras
 */

/**
 * Genera un slug a partir del nombre del coche
 * @param car - Objeto Car del cual generar el slug
 * @returns Slug generado (ej: "mercedes-benz-amg-gt-r")
 */
export const generateCarSlug = (car: Car): string => {
  return `${car.make}-${car.model}`.toLowerCase().replace(/\s+/g, "-");
};

/**
 * Obtiene un coche por su ID
 * @param id - ID del coche a buscar
 * @returns El coche encontrado o undefined si no existe
 */
export const getCarById = (id: string): Car | undefined => {
  return CARS_DATA.find((car) => car.id === id);
};

/**
 * Obtiene un coche por su slug
 * @param slug - Slug del coche a buscar
 * @returns El coche encontrado o undefined si no existe
 */
export const getCarBySlug = (slug: string): Car | undefined => {
  return CARS_DATA.find((car) => generateCarSlug(car) === slug);
};

/**
 * Obtiene todos los coches disponibles (status === "available")
 * @returns Array de coches disponibles
 */
export const getAvailableCars = (): Car[] => {
  return CARS_DATA.filter((car) => car.status === "available");
};

/**
 * Obtiene coches filtrados por categoría
 * @param category - Categoría a filtrar (luxury, suv, premium, etc.)
 * @returns Array de coches que pertenecen a la categoría especificada
 */
export const getCarsByCategory = (category: string): Car[] => {
  return CARS_DATA.filter(
    (car) => car.category?.toLowerCase() === category.toLowerCase()
  );
};

