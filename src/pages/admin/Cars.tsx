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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { generateCarSlug } from '@/data/carsHelpers';

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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Coches</h2>
        <Link to="/admin/cars/new">
          <Button className="w-full sm:w-auto justify-center text-xs sm:text-sm" size="sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Añadir Vehículo</span>
            <span className="sm:hidden">Añadir</span>
          </Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-x-auto -mx-3 sm:mx-0">
        <Table className="min-w-[720px] sm:min-w-0">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Imagen</TableHead>
              <TableHead className="text-xs sm:text-sm">Marca</TableHead>
              <TableHead className="text-xs sm:text-sm">Modelo</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Año</TableHead>
              <TableHead className="text-xs sm:text-sm">Precio</TableHead>
              <TableHead className="text-xs sm:text-sm hidden md:table-cell">Estado</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs sm:text-sm py-4">Cargando...</TableCell>
              </TableRow>
            ) : cars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs sm:text-sm py-4">No se encontraron vehículos</TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow
                  key={car.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(car.id)}
                >
                  <TableCell className="py-2 sm:py-4">
                    {car.images && car.images.length > 0 && (
                      <img src={car.images[0]} alt={car.model} className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded" />
                    )}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{car.make}</TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4">{car.model}</TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">{car.year}</TableCell>
                  <TableCell className="text-xs sm:text-sm py-2 sm:py-4 font-medium">{car.price.toLocaleString()} €</TableCell>
                  <TableCell className="py-2 sm:py-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs ${
                      car.status === 'available' ? 'bg-green-100 text-green-800' :
                      car.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status === 'available' ? 'Disponible' : 
                       car.status === 'sold' ? 'Vendido' : 'Reservado'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-2 sm:py-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-10 sm:w-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = generateCarSlug(car);
                          window.open(`/coches/${slug}`, '_blank');
                        }}
                        title="Ver página pública"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Link to={`/admin/cars/${car.id}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-10 sm:w-10"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-10 sm:w-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(car.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
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
