import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Función de prueba para verificar la conexión con Firebase
 * y probar la estructura de datos antes de la migración completa
 */
export const testFirebaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!db) {
    return {
      success: false,
      message: '❌ Firebase no está inicializado. Verifica las credenciales en .env'
    };
  }

  try {
    console.log('🔄 Probando conexión con Firebase...');

    // 1. Probar lectura de la colección cars
    const carsRef = collection(db, 'cars');
    const snapshot = await getDocs(carsRef);
    console.log(`📊 Vehículos actuales en Firestore: ${snapshot.size}`);

    // 2. Probar escritura con un documento de prueba
    const testCar = {
      make: 'Test',
      model: 'Car',
      year: 2024,
      price: 100000,
      mileage: 0,
      fuelType: 'Electric',
      transmission: 'Automatic',
      images: ['/test.jpg'],
      description: 'Test car for Firebase connection',
      category: 'luxury',
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('🔄 Intentando escribir un documento de prueba...');
    const docRef = await addDoc(carsRef, testCar);
    console.log('✅ Documento de prueba escrito con ID:', docRef.id);

    return {
      success: true,
      message: `✅ Conexión exitosa! Documentos en Firestore: ${snapshot.size + 1}`
    };
  } catch (error: any) {
    console.error('❌ Error en la prueba:', error);
    return {
      success: false,
      message: `❌ Error: ${error.message || 'Unknown error'}`
    };
  }
};

// Exponer la función en window para pruebas desde consola
if (typeof window !== 'undefined') {
  (window as any).testFirebaseConnection = testFirebaseConnection;
}

