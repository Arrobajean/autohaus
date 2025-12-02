import { Car } from "@/types";

/**
 * Calcula el pago mensual aproximado basado en el precio del coche
 */
export const calculateMonthlyPayment = (price: number): number => {
  return Math.round(price / 60); // Aproximado: 60 meses
};

/**
 * Genera el título de la página para SEO
 */
export const generatePageTitle = (car: Car): string => {
  return `${car.make} ${car.model} ${car.year} | AutoHaus`;
};

/**
 * Distribuye las imágenes disponibles en las 4 cards del parallax
 * Si hay menos de 4 imágenes, repite algunas para llenar todas las cards
 */
export const distributeParallaxImages = (images: string[]): string[] => {
  if (!images || images.length === 0) return [];
  
  // Si hay 4 o más imágenes, toma las primeras 4
  if (images.length >= 4) {
    return images.slice(0, 4);
  }
  
  // Si hay menos de 4, repite para completar 4 cards
  const cards: string[] = [];
  for (let i = 0; i < 4; i++) {
    cards.push(images[i % images.length]);
  }
  
  return cards;
};

/**
 * Formatea el precio del coche para mostrar
 */
export const formatCarPrice = (price: number): string => {
  return `${price.toLocaleString("es-ES")} €`;
};

/**
 * Obtiene el color de fondo según la categoría del coche
 */
export const getCategoryColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case "luxury":
      return "bg-yellow-100 text-yellow-800";
    case "suv":
      return "bg-blue-100 text-blue-800";
    case "premium":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

