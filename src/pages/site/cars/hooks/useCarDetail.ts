import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { getCarBySlug } from "@/data/carsHelpers";

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
        const mockCar = getCarBySlug(slug);
        setCar(mockCar || null);
        setLoading(false);
        return;
      }

      try {
        const mockCar = getCarBySlug(slug);
        if (mockCar) {
          setCar(mockCar);
        } else {
          const mockCar = getCarBySlug(slug);
          setCar(mockCar || null);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
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

