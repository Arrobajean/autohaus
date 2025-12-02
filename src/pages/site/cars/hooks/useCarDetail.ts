import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { getCarBySlug, generateCarSlug } from "@/data/carsHelpers";

export const useCarDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      if (!db) {
        // Fallback a datos mock si Firebase no está configurado
        const mockCar = getCarBySlug(slug);
        setCar(mockCar || null);
        setLoading(false);
        return;
      }

      try {
        // Buscar en Firestore
        const carsRef = collection(db, "cars");
        const querySnapshot = await getDocs(carsRef);
        
        if (!querySnapshot.empty) {
          // Buscar el coche que coincida con el slug
          const cars = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Car)
          );
          
          const foundCar = cars.find((car) => {
            const carSlug = generateCarSlug(car);
            return carSlug === slug;
          });

          if (foundCar) {
            setCar(foundCar);
          } else {
            // Si no se encuentra en Firestore, usar datos mock como fallback
            const mockCar = getCarBySlug(slug);
            setCar(mockCar || null);
          }
        } else {
          // Si Firestore está vacío, usar datos mock
          const mockCar = getCarBySlug(slug);
          setCar(mockCar || null);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
        // Fallback a datos mock en caso de error
        const mockCar = getCarBySlug(slug);
        setCar(mockCar || null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [slug]);

  return { car, loading, selectedImageIndex, setSelectedImageIndex };
};

