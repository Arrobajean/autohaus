import { useState, useEffect, useMemo, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  SortField,
  SortDirection,
  StatusFilter,
  filterAndSortCars,
} from "../helpers/carsListHelpers";

export const useCarsList = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const navigate = useNavigate();

  const fetchCars = useCallback(async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const carsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Car)
      );
      setCars(carsData);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleDeleteClick = useCallback((id: string) => {
    setCarToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!carToDelete || !db) return;

    try {
      await deleteDoc(doc(db, "cars", carToDelete));
      toast.success("Vehículo eliminado correctamente");
      setDeleteDialogOpen(false);
      setCarToDelete(null);
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Error al eliminar el vehículo");
    }
  }, [carToDelete, fetchCars]);

  const handleRowClick = useCallback(
    (id: string) => {
      navigate(`/admin/cars/${id}`);
    },
    [navigate]
  );

  const sortedCars = useMemo(() => {
    return filterAndSortCars(cars, statusFilter, sortField, sortDirection);
  }, [cars, sortField, sortDirection, statusFilter]);

  const handleSort = useCallback(
    (field: Exclude<SortField, null>) => {
      if (sortField !== field) {
        setSortField(field);
        setSortDirection("asc");
        return;
      }

      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    },
    [sortField, sortDirection]
  );

  return {
    cars,
    loading,
    sortedCars,
    deleteDialogOpen,
    carToDelete,
    sortField,
    sortDirection,
    statusFilter,
    setDeleteDialogOpen,
    setCarToDelete,
    setStatusFilter,
    handleDeleteClick,
    handleDelete,
    handleRowClick,
    handleSort,
    refetchCars: fetchCars,
  };
};
