import { Car } from "@/types";

export type SortField = "make" | "year" | "price" | "status" | null;
export type SortDirection = "asc" | "desc";
export type StatusFilter = "all" | "available" | "reserved" | "sold";

/**
 * Filtra los coches por estado
 */
export const filterCarsByStatus = (
  cars: Car[],
  statusFilter: StatusFilter
): Car[] => {
  if (statusFilter === "all") {
    return cars;
  }
  return cars.filter((car) => car.status === statusFilter);
};

/**
 * Ordena los coches según el campo y dirección especificados
 */
export const sortCars = (
  cars: Car[],
  sortField: SortField,
  sortDirection: SortDirection
): Car[] => {
  if (!sortField) {
    return cars;
  }

  const sorted = [...cars];

  sorted.sort((a, b) => {
    if (sortField === "make") {
      const aMake = a.make || "";
      const bMake = b.make || "";
      const res = aMake.localeCompare(bMake, "es", { sensitivity: "base" });
      return sortDirection === "asc" ? res : -res;
    }

    if (sortField === "status") {
      const statusOrder = { available: 1, reserved: 2, sold: 3 };
      const aStatus = statusOrder[a.status as keyof typeof statusOrder] || 0;
      const bStatus = statusOrder[b.status as keyof typeof statusOrder] || 0;
      const res = aStatus - bStatus;
      return sortDirection === "asc" ? res : -res;
    }

    let aVal = 0;
    let bVal = 0;

    if (sortField === "year") {
      aVal = a.year ?? 0;
      bVal = b.year ?? 0;
    } else if (sortField === "price") {
      aVal = a.price ?? 0;
      bVal = b.price ?? 0;
    }

    const res = aVal - bVal;
    return sortDirection === "asc" ? res : -res;
  });

  return sorted;
};

/**
 * Filtra y ordena los coches
 */
export const filterAndSortCars = (
  cars: Car[],
  statusFilter: StatusFilter,
  sortField: SortField,
  sortDirection: SortDirection
): Car[] => {
  const filtered = filterCarsByStatus(cars, statusFilter);
  return sortCars(filtered, sortField, sortDirection);
};

