import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { getAvailableCars } from "@/data/carsHelpers";
import { findSimilarCars } from "../utils/findSimilarCars";

export const useParallaxAnimations = (car: Car | null) => {
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const { scrollYProgress } = useScroll();

  // Movimiento parallax para las imágenes laterales - velocidades diferentes para efecto de profundidad
  const y1 = useTransform(scrollYProgress, [0, 1], [400, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-300, 300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [350, -350]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-350, 350]);

  // Opacidades para las cards laterales - aparecen y desaparecen gradualmente
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85],
    [0, 1, 1, 0]
  );
  const opacity2 = useTransform(
    scrollYProgress,
    [0.08, 0.23, 0.58, 0.92],
    [0, 1, 1, 0]
  );
  const opacity3 = useTransform(
    scrollYProgress,
    [0.04, 0.19, 0.54, 0.88],
    [0, 1, 1, 0]
  );
  const opacity4 = useTransform(
    scrollYProgress,
    [0.12, 0.27, 0.62, 0.95],
    [0, 1, 1, 0]
  );

  // Opacidades para el texto central - permanece más tiempo visible
  const textOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0.2]
  );
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 0.4]
  );

  const parallaxAnimations = {
    y1,
    y2,
    y3,
    y4,
    opacity1,
    opacity2,
    opacity3,
    opacity4,
    textOpacity,
    subtitleOpacity,
  };

  useEffect(() => {
    const fetchSimilarCars = async () => {
      if (!car) return;

      let allCars: Car[] = [];

      if (!db) {
        allCars = getAvailableCars();
      } else {
        try {
          const q = query(
            collection(db, "cars"),
            where("status", "==", "available")
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            allCars = getAvailableCars();
          } else {
            allCars = querySnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Car)
            );
          }
        } catch (error) {
          console.error("Error fetching cars for similar:", error);
          allCars = getAvailableCars();
        }
      }

      const similar = findSimilarCars(car, allCars, 3);
      setSimilarCars(similar);
    };

    fetchSimilarCars();
  }, [car]);

  return { parallaxAnimations, similarCars };
};

