import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { getAvailableCars } from "@/data/carsHelpers";

export type Category = "all" | "luxury" | "suv" | "premium";

export const useCars = (selectedCategory: Category) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      if (!db) {
        setCars(getAvailableCars());
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "cars"),
          where("status", "==", "available")
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setCars(getAvailableCars());
        } else {
          const carsData = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Car)
          );
          setCars(carsData);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars(getAvailableCars());
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter((car) => {
    if (selectedCategory === "all") return true;
    return car.category?.toLowerCase() === selectedCategory;
  });

  return {
    cars: filteredCars,
    loading,
  };
};

