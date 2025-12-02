import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { CARS_DATA } from '@/data/carsData';
import { Car } from '@/types';

/**
 * Migra los datos de vehículos desde el archivo local a Firestore
 * Esta función verifica si ya existen datos en Firestore antes de migrar
 * @param force - Si es true, migra incluso si ya hay datos (útil para desarrollo)
 */
export const migrateCarsToFirebase = async (force: boolean = false): Promise<{ success: boolean; message: string }> => {
  if (!db) {
    return {
      success: false,
      message: 'Firebase no está configurado. Verifica tu archivo .env'
    };
  }

  try {
    // Verificar si ya hay datos en Firestore
    const carsRef = collection(db, 'cars');
    const existingCars = await getDocs(carsRef);

    if (!existingCars.empty && !force) {
      return {
        success: false,
        message: `Ya existen ${existingCars.size} vehículos en Firestore. Usa el modo forzado para migrar de todos modos.`
      };
    }

    // Preparar los datos para migración
    const carsToMigrate = CARS_DATA.map(car => {
      // Remover el id del objeto ya que Firestore lo generará automáticamente
      const { id, createdAt, updatedAt, ...carData } = car;
      
      return {
        ...carData,
        // Usar serverTimestamp para las fechas (Firestore las manejará automáticamente)
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
    });

    // Migrar todos los vehículos
    const migrationPromises = carsToMigrate.map(async (carData) => {
      await addDoc(carsRef, carData);
    });

    await Promise.all(migrationPromises);

    return {
      success: true,
      message: `Migración exitosa: ${CARS_DATA.length} vehículos migrados a Firestore`
    };
  } catch (error: any) {
    console.error('Error durante la migración:', error);
    return {
      success: false,
      message: `Error durante la migración: ${error.message}`
    };
  }
};

/**
 * Función helper para ejecutar la migración desde la consola del navegador
 * Uso: En la consola del navegador, ejecuta:
 * window.migrateCarsToFirebase()
 */
if (typeof window !== 'undefined') {
  (window as any).migrateCarsToFirebase = migrateCarsToFirebase;
}

