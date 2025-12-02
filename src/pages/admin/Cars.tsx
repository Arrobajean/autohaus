import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Car } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CarsList = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCars = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, 'cars'));
      const carsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
      setCars(carsData);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) return;
    
    try {
      await deleteDoc(doc(db, 'cars', id));
      toast.success('Vehículo eliminado correctamente');
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error('Error al eliminar el vehículo');
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/admin/cars/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Coches</h2>
        <Link to="/admin/cars/new">
          <Button className="w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Añadir Vehículo
          </Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table className="min-w-[720px] sm:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Cargando...</TableCell>
              </TableRow>
            ) : cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No se encontraron vehículos</TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow
                  key={car.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(car.id)}
                >
                  <TableCell>
                    {car.images && car.images.length > 0 && (
                      <img src={car.images[0]} alt={car.model} className="w-16 h-10 object-cover rounded" />
                    )}
                  </TableCell>
                  <TableCell>{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.price.toLocaleString()} €</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      car.status === 'available' ? 'bg-green-100 text-green-800' :
                      car.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status === 'available' ? 'Disponible' : 
                       car.status === 'sold' ? 'Vendido' : 'Reservado'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/cars/${car.id}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(car.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CarsList;
