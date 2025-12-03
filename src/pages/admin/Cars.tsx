import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Car } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CarsList = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
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

  const handleDeleteClick = (id: string) => {
    setCarToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!carToDelete || !db) return;
    
    try {
      await deleteDoc(doc(db, 'cars', carToDelete));
      toast.success('Vehículo eliminado correctamente');
      setDeleteDialogOpen(false);
      setCarToDelete(null);
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
    <div className="space-y-2 md:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">Coches</h2>
        <Link to="/admin/cars/new">
          <Button className="w-full sm:w-auto justify-center text-xs h-8 sm:h-9" size="sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Añadir Vehículo</span>
            <span className="sm:hidden">Añadir</span>
          </Button>
        </Link>
      </div>

      {/* Vista móvil: Cards */}
      <div className="block md:hidden space-y-2">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-[#2a2a2a] rounded-lg p-2 bg-[#1a1a1a]">
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-12 rounded flex-shrink-0 bg-[#2a2a2a]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-[#2a2a2a]" />
                    <Skeleton className="h-3 w-1/2 bg-[#2a2a2a]" />
                    <div className="flex justify-end gap-1 mt-2">
                      <Skeleton className="h-7 w-7 rounded bg-[#2a2a2a]" />
                      <Skeleton className="h-7 w-7 rounded bg-[#2a2a2a]" />
                      <Skeleton className="h-7 w-7 rounded bg-[#2a2a2a]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : cars.length === 0 ? (
          <div className="text-center text-xs py-4 text-gray-400">No se encontraron vehículos</div>
        ) : (
          cars.map((car) => (
            <div
              key={car.id}
              className="border border-[#2a2a2a] rounded-lg p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              onClick={() => handleRowClick(car.id)}
            >
              <div className="flex gap-2">
                {/* Imagen */}
                <div className="flex-shrink-0">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-[#2a2a2a] rounded flex items-center justify-center">
                      <span className="text-[8px] text-gray-500">Sin img</span>
                    </div>
                  )}
                </div>

                {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold truncate text-white">
                            {car.make} {car.model}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400">{car.year}</span>
                            <span className="text-[10px] text-gray-500">•</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                          car.status === 'available' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          car.status === 'sold' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {car.status === 'available' ? 'Disponible' : 
                           car.status === 'sold' ? 'Vendido' : 'Reservado'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-white">{car.price.toLocaleString()} €</div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:text-gray-200 hover:bg-[#2a2a2a]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const slug = generateCarSlug(car);
                        window.open(`/coches/${slug}`, '_blank');
                      }}
                      title="Ver página pública"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Link to={`/admin/cars/${car.id}`} onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:text-gray-200 hover:bg-[#2a2a2a]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <AlertDialog open={deleteDialogOpen && carToDelete === car.id} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(car.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">¿Eliminar vehículo?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo "{car.make} {car.model}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCarToDelete(null)} className="bg-[#2a2a2a] border-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a]">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vista desktop: Tabla */}
      <div className="hidden md:block border border-[#2a2a2a] rounded-md overflow-x-auto bg-[#1a1a1a]">
        <Table className="text-xs sm:text-sm">
          <TableHeader>
            <TableRow className="h-8 sm:h-10 border-[#2a2a2a] hover:bg-[#2a2a2a]">
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Imagen</TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Marca</TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Modelo</TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Año</TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Precio</TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Estado</TableHead>
              <TableHead className="text-right text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-[#2a2a2a]">
                    <TableCell className="py-2 px-4">
                      <Skeleton className="w-14 h-9 rounded bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <Skeleton className="h-4 w-20 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <Skeleton className="h-4 w-24 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <Skeleton className="h-4 w-16 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <Skeleton className="h-4 w-24 bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      <Skeleton className="h-6 w-20 rounded-full bg-[#2a2a2a]" />
                    </TableCell>
                    <TableCell className="text-right py-2 px-4">
                      <div className="flex justify-end gap-1">
                        <Skeleton className="h-8 w-8 rounded bg-[#2a2a2a]" />
                        <Skeleton className="h-8 w-8 rounded bg-[#2a2a2a]" />
                        <Skeleton className="h-8 w-8 rounded bg-[#2a2a2a]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : cars.length === 0 ? (
              <TableRow className="border-[#2a2a2a]">
                <TableCell colSpan={7} className="text-center text-xs py-2 sm:py-3 text-gray-400">No se encontraron vehículos</TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow
                  key={car.id}
                  className="cursor-pointer hover:bg-[#2a2a2a] h-12 sm:h-14 border-[#2a2a2a]"
                  onClick={() => handleRowClick(car.id)}
                >
                  <TableCell className="py-1 sm:py-2 px-2 sm:px-4">
                    {car.images && car.images.length > 0 && (
                      <img src={car.images[0]} alt={car.model} className="w-14 h-9 object-cover rounded" />
                    )}
                  </TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 font-medium text-white">{car.make}</TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 text-gray-200">{car.model}</TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 text-gray-200">{car.year}</TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 font-semibold text-white">{car.price.toLocaleString()} €</TableCell>
                  <TableCell className="py-1 sm:py-2 px-2 sm:px-4">
                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[10px] border ${
                      car.status === 'available' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      car.status === 'sold' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {car.status === 'available' ? 'Disponible' : 
                       car.status === 'sold' ? 'Vendido' : 'Reservado'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-1 sm:py-2 px-2 sm:px-4">
                    <div className="flex justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white hover:text-gray-200 hover:bg-[#2a2a2a]"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = generateCarSlug(car);
                          window.open(`/coches/${slug}`, '_blank');
                        }}
                        title="Ver página pública"
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </Button>
                      <Link to={`/admin/cars/${car.id}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white hover:text-gray-200 hover:bg-[#2a2a2a]"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </Button>
                      </Link>
                      <AlertDialog open={deleteDialogOpen && carToDelete === car.id} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(car.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo "{car.make} {car.model}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCarToDelete(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
