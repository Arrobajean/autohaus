import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { generateCarSlug } from "@/data/carsHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import { useCarsList } from "../features/cars/hooks/useCarsList";
import { SortIcon } from "../features/cars/components/SortIcon";
import { StatusFilter } from "../features/cars/helpers/carsListHelpers";

const CarsList = () => {
  const {
    loading,
    sortedCars,
    deleteDialogOpen,
    carToDelete,
    sortField,
    sortDirection,
    statusFilter,
    setDeleteDialogOpen,
    setCarToDelete,
    setStatusFilter,
    handleDeleteClick,
    handleDelete,
    handleRowClick,
    handleSort,
  } = useCarsList();

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
          Coches
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-8 sm:h-9 text-xs sm:text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <SelectItem value="all" className="text-white hover:bg-[#2a2a2a]">
                Todos los estados
              </SelectItem>
              <SelectItem
                value="available"
                className="text-white hover:bg-[#2a2a2a]"
              >
                Disponible
              </SelectItem>
              <SelectItem
                value="reserved"
                className="text-white hover:bg-[#2a2a2a]"
              >
                Reservado
              </SelectItem>
              <SelectItem
                value="sold"
                className="text-white hover:bg-[#2a2a2a]"
              >
                Vendido
              </SelectItem>
            </SelectContent>
          </Select>
          <Link to="/admin/cars/new">
            <Button
              className="w-full sm:w-auto justify-center text-xs h-8 sm:h-9"
              size="sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Añadir Vehículo</span>
              <span className="sm:hidden">Añadir</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Vista móvil: Cards */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-[#2a2a2a] rounded-lg p-3 bg-[#1a1a1a]"
              >
                <div className="flex gap-3">
                  <Skeleton className="w-24 h-24 rounded-md flex-shrink-0 bg-[#2a2a2a]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-[#2a2a2a]" />
                    <Skeleton className="h-3 w-1/2 bg-[#2a2a2a]" />
                    <Skeleton className="h-3 w-2/3 bg-[#2a2a2a]" />
                    <div className="flex justify-end gap-2 mt-2">
                      <Skeleton className="h-8 w-8 rounded bg-[#2a2a2a]" />
                      <Skeleton className="h-8 w-8 rounded bg-[#2a2a2a]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : sortedCars.length === 0 ? (
          <div className="text-center text-sm py-8 text-gray-400 border border-dashed border-[#2a2a2a] rounded-lg">
            No se encontraron vehículos
          </div>
        ) : (
          sortedCars.map((car) => (
            <div
              key={car.id}
              className="group border border-[#2a2a2a] rounded-xl p-3 bg-[#1a1a1a] active:bg-[#222] transition-all cursor-pointer shadow-sm"
              onClick={() => handleRowClick(car.id)}
            >
              <div className="flex gap-3">
                {/* Imagen */}
                <div className="flex-shrink-0 relative">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      className="w-24 h-24 object-cover rounded-lg border border-[#2a2a2a]"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-[#222] rounded-lg border border-[#2a2a2a] flex items-center justify-center">
                      <span className="text-[10px] text-gray-500">
                        Sin foto
                      </span>
                    </div>
                  )}
                  <div className="absolute top-1 left-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium border shadow-sm ${
                        car.status === "available"
                          ? "bg-green-950/80 text-green-400 border-green-500/30"
                          : car.status === "sold"
                          ? "bg-red-950/80 text-red-400 border-red-500/30"
                          : "bg-yellow-950/80 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {car.status === "available"
                        ? "Disponible"
                        : car.status === "sold"
                        ? "Vendido"
                        : "Reservado"}
                    </span>
                  </div>
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {car.make}{" "}
                        <span className="text-gray-300 font-normal">
                          {car.model}
                        </span>
                      </h3>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">
                      {car.year} • {car.mileage?.toLocaleString()} km
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <div className="text-base font-bold text-white tracking-tight">
                      {car.price.toLocaleString()} €
                    </div>

                    {/* Acciones */}
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = generateCarSlug(car);
                          window.open(`/coches/${slug}`, "_blank");
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link
                        to={`/admin/cars/${car.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog
                        open={deleteDialogOpen && carToDelete === car.id}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(car.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white w-[90%] rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              ¿Eliminar vehículo?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row gap-2 justify-end">
                            <AlertDialogCancel
                              onClick={() => setCarToDelete(null)}
                              className="bg-[#2a2a2a] border-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a] mt-0"
                            >
                              Cancelar
                            </AlertDialogCancel>
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
            </div>
          ))
        )}
      </div>

      {/* Vista desktop: Tabla */}
      <div className="hidden md:block border border-[#2a2a2a] rounded-md overflow-x-auto bg-[#1a1a1a]">
        <Table className="text-xs sm:text-sm">
          <TableHeader>
            <TableRow className="h-8 sm:h-10 border-[#2a2a2a] hover:bg-[#2a2a2a]">
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">
                Imagen
              </TableHead>
              <TableHead
                className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300 cursor-pointer select-none"
                onClick={() => handleSort("make")}
              >
                <div className="flex items-center gap-1">
                  <span>Marca</span>
                  <SortIcon
                    field="make"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">
                Modelo
              </TableHead>
              <TableHead
                className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300 cursor-pointer select-none"
                onClick={() => handleSort("year")}
              >
                <div className="flex items-center gap-1">
                  <span>Año</span>
                  <SortIcon
                    field="year"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead
                className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300 cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center gap-1">
                  <span>Precio</span>
                  <SortIcon
                    field="price"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead
                className="text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300 cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  <span>Estado</span>
                  <SortIcon
                    field="status"
                    currentSortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right text-[10px] sm:text-xs px-2 sm:px-4 text-gray-300">
                Acciones
              </TableHead>
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
            ) : sortedCars.length === 0 ? (
              <TableRow className="border-[#2a2a2a]">
                <TableCell
                  colSpan={7}
                  className="text-center text-xs py-2 sm:py-3 text-gray-400"
                >
                  No se encontraron vehículos
                </TableCell>
              </TableRow>
            ) : (
              sortedCars.map((car) => (
                <TableRow
                  key={car.id}
                  className="cursor-pointer hover:bg-[#2a2a2a] h-12 sm:h-14 border-[#2a2a2a]"
                  onClick={() => handleRowClick(car.id)}
                >
                  <TableCell className="py-1 sm:py-2 px-2 sm:px-4">
                    {car.images && car.images.length > 0 && (
                      <img
                        src={car.images[0]}
                        alt={car.model}
                        className="w-14 h-9 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 font-medium text-white">
                    {car.make}
                  </TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 text-gray-200">
                    {car.model}
                  </TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 text-gray-200">
                    {car.year}
                  </TableCell>
                  <TableCell className="text-[11px] sm:text-sm py-1 sm:py-2 px-2 sm:px-4 font-semibold text-white">
                    {car.price.toLocaleString()} €
                  </TableCell>
                  <TableCell className="py-1 sm:py-2 px-2 sm:px-4">
                    <span
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[10px] border ${
                        car.status === "available"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : car.status === "sold"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }`}
                    >
                      {car.status === "available"
                        ? "Disponible"
                        : car.status === "sold"
                        ? "Vendido"
                        : "Reservado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-1 sm:py-2 px-2 sm:px-4">
                    <div className="flex justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          const slug = generateCarSlug(car);
                          window.open(`/coches/${slug}`, "_blank");
                        }}
                        title="Ver página pública"
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </Button>
                      <Link
                        to={`/admin/cars/${car.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </Button>
                      </Link>
                      <AlertDialog
                        open={deleteDialogOpen && carToDelete === car.id}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(car.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar vehículo?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente el vehículo "{car.make}{" "}
                              {car.model}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setCarToDelete(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
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
