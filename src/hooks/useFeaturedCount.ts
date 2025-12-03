import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useFeaturedCount = (carId?: string) => {
  const [featuredCount, setFeaturedCount] = useState(0);

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      if (!db) return;
      try {
        // Contar coches destacados
        try {
          const featuredQuery = query(
            collection(db, "cars"),
            where("featured", "==", true)
          );
          const featuredSnapshot = await getDocs(featuredQuery);
          const count = featuredSnapshot.docs.filter(
            (doc) => (carId ? doc.id !== carId : true) // Excluir el coche actual si es edición
          ).length;
          setFeaturedCount(count);
        } catch (queryError: any) {
          // Si la consulta falla, contar manualmente
          const allCarsSnapshot = await getDocs(collection(db, "cars"));
          const count = allCarsSnapshot.docs.filter((doc) => {
            const data = doc.data();
            return data.featured === true && (carId ? doc.id !== carId : true);
          }).length;
          setFeaturedCount(count);
        }
      } catch (error) {
        console.error("Error fetching featured count:", error);
      }
    };

    fetchFeaturedCount();
  }, [carId]);

  return featuredCount;
};

