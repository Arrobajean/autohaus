import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { migrateCarsToFirebase } from '@/lib/migrateDataToFirebase';
import { testFirebaseConnection } from '@/lib/testFirebaseConnection';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2, Database, TestTube } from 'lucide-react';

const Dashboard = () => {
  const [migrating, setMigrating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        setTotalCars(carsSnapshot.size);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleTest = async () => {
    setTesting(true);
    const result = await testFirebaseConnection();
    if (result.success) {
      toast.success(result.message);
      // Refrescar stats
      if (db) {
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        setTotalCars(carsSnapshot.size);
      }
    } else {
      toast.error(result.message);
    }
    setTesting(false);
  };

  const handleMigrate = async () => {
    setMigrating(true);
    // Primero intentar migración normal, si falla por datos existentes, preguntar
    const result = await migrateCarsToFirebase(false);
    if (result.success) {
      toast.success(result.message);
      // Recargar stats
      if (db) {
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        setTotalCars(carsSnapshot.size);
      }
    } else {
      // Si hay datos existentes, ofrecer migración forzada
      if (result.message.includes('Ya existen')) {
        const forceMigrate = window.confirm(
          `${result.message}\n\n¿Deseas migrar de todos modos? (Esto añadirá los datos sin eliminar los existentes)`
        );
        if (forceMigrate) {
          const forceResult = await migrateCarsToFirebase(true);
          if (forceResult.success) {
            toast.success(forceResult.message);
            if (db) {
              const carsSnapshot = await getDocs(collection(db, 'cars'));
              setTotalCars(carsSnapshot.size);
            }
          } else {
            toast.error(forceResult.message);
          }
        }
      } else {
        toast.error(result.message);
      }
    }
    setMigrating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleTest} 
            disabled={testing}
            variant="outline"
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Probar Conexión
              </>
            )}
          </Button>
          <Button 
            onClick={handleMigrate} 
            disabled={migrating}
            variant="default"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migrando...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Migrar Datos a Firebase
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Coches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalCars}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalCars === 0 ? 'Sin vehículos en Firebase' : 'En Firestore'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Firebase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {db ? '✅' : '❌'}
            </div>
            <p className="text-xs text-muted-foreground">
              {db ? 'Conectado' : 'Desconectado'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
