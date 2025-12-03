import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Car } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X, Upload, ArrowUp, ArrowDown, Star } from 'lucide-react';
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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    description: '',
    status: 'available',
    category: 'luxury',
    featured: false,
    images: [],
    // Especificaciones técnicas
    topSpeed: undefined,
    power: undefined,
    acceleration: undefined,
    exterior: '',
    interior: '',
    drivetrain: '',
    engine: '',
    seats: undefined,
  });
  const [originalFeatured, setOriginalFeatured] = useState(false);
  const [featuredCount, setFeaturedCount] = useState(0);

  useEffect(() => {
    const fetchFeaturedCount = async () => {
      if (!db) return;
      try {
        // Contar coches destacados
        try {
          const featuredQuery = query(
            collection(db, 'cars'),
            where('featured', '==', true)
          );
          const featuredSnapshot = await getDocs(featuredQuery);
          const count = featuredSnapshot.docs.filter(
            doc => id ? doc.id !== id : true // Excluir el coche actual si es edición
          ).length;
          setFeaturedCount(count);
        } catch (queryError: any) {
          // Si la consulta falla, contar manualmente
          const allCarsSnapshot = await getDocs(collection(db, 'cars'));
          const count = allCarsSnapshot.docs.filter(
            doc => {
              const data = doc.data();
              return data.featured === true && (id ? doc.id !== id : true);
            }
          ).length;
          setFeaturedCount(count);
        }
      } catch (error) {
        console.error("Error fetching featured count:", error);
      }
    };

    fetchFeaturedCount();
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        if (!db) return;
        try {
          const docRef = doc(db, 'cars', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Car;
            setFormData(data);
            setOriginalFeatured(data.featured || false);
            setImageUrls(data.images || []);
          }
        } catch (error) {
          console.error("Error fetching car:", error);
          toast.error("No se pudo cargar los datos del vehículo");
        }
      };
      fetchCar();
    }
  }, [id]);

  const handleImageChange = async (allFiles: File[]) => {
    if (!storage) {
      toast.error("Firebase Storage no está configurado.");
      return;
    }

    // Identificar archivos nuevos (que no están en el estado actual)
    const existingFilesSet = new Set(
      images.map(f => `${f.name}-${f.size}-${f.lastModified}`)
    );
    const newFiles = allFiles.filter(
      file => !existingFilesSet.has(`${file.name}-${file.size}-${file.lastModified}`)
    );

    // Si hay archivos nuevos, subirlos automáticamente
    if (newFiles.length > 0) {
      setUploading(true);
      try {
        const uploadedUrls: string[] = [];
        
        // Subir cada archivo nuevo
        for (const file of newFiles) {
          const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          uploadedUrls.push(url);
        }

        // Agregar las URLs subidas al estado de imageUrls
        setImageUrls(prev => [...prev, ...uploadedUrls]);
        
        // Limpiar las previews temporales de los archivos subidos
        newFiles.forEach(file => {
          const previewIndex = imagePreviews.findIndex((_, idx) => {
            const oldFile = images[idx];
            return oldFile && oldFile.name === file.name && oldFile.size === file.size;
          });
          if (previewIndex >= 0) {
            URL.revokeObjectURL(imagePreviews[previewIndex]);
          }
        });

        // Limpiar el estado de imágenes para que el componente FileUpload se vacíe
        // Las imágenes ya están subidas y en imageUrls
        setImages([]);
        setImagePreviews([]);
        
        toast.success(`${newFiles.length} imagen${newFiles.length > 1 ? 'es' : ''} subida${newFiles.length > 1 ? 's' : ''} correctamente`);
      } catch (error: any) {
        console.error("Error subiendo imágenes:", error);
        toast.error(`Error al subir imágenes: ${error.message}`);
        // Si hay error, mantener los archivos en el estado para que el usuario pueda intentar de nuevo
        setImages(allFiles);
      } finally {
        setUploading(false);
      }
    } else {
      // Si no hay archivos nuevos pero se eliminaron algunos, actualizar el estado
      setImages(allFiles);
    }
  };

  const handleRemoveImageClick = (index: number) => {
    setImageToDeleteIndex(index);
    setDeleteImageDialogOpen(true);
  };

  const removeImage = () => {
    if (imageToDeleteIndex === null) return;
    setImageUrls(prev => prev.filter((_, i) => i !== imageToDeleteIndex));
    setDeleteImageDialogOpen(false);
    setImageToDeleteIndex(null);
    toast.success('Imagen eliminada');
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setImageUrls(prev => {
      const newUrls = [...prev];
      [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
      return newUrls;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return;
    setImageUrls(prev => {
      const newUrls = [...prev];
      [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
      return newUrls;
    });
  };

  const setHeroImage = (index: number) => {
    setImageUrls(prev => {
      const newUrls = [...prev];
      const heroImage = newUrls[index];
      newUrls.splice(index, 1);
      return [heroImage, ...newUrls];
    });
  };

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setImageUrls(prev => {
      const newUrls = [...prev];
      const [moved] = newUrls.splice(draggedIndex, 1);
      newUrls.splice(index, 0, moved);
      return newUrls;
    });
    setDraggedIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };


  const handlePreviewPage = () => {
    if (!formData.make || !formData.model) {
      toast.error("Completa al menos la marca y el modelo para previsualizar.");
      return;
    }

    const fakeCar: Car = {
      id: formData.id || "preview",
      make: formData.make,
      model: formData.model,
      year: formData.year || new Date().getFullYear(),
      price: formData.price || 0,
      mileage: formData.mileage || 0,
      fuelType: formData.fuelType || "Gasoline",
      transmission: formData.transmission || "Automática",
      images: imagePreviews.length > 0 ? imagePreviews : imageUrls,
      description: formData.description || "",
      category: formData.category,
      status: formData.status || "available",
      createdAt: new Date(),
      updatedAt: new Date(),
      topSpeed: formData.topSpeed,
      power: formData.power,
      acceleration: formData.acceleration,
      exterior: formData.exterior,
      interior: formData.interior,
      drivetrain: formData.drivetrain,
      engine: formData.engine,
      seats: formData.seats,
    };

    const returnTo = id ? `/admin/cars/${id}` : "/admin/cars/new";
    navigate("/preview/coche", { state: { car: fakeCar, returnTo } });
  };

  const saveCar = async () => {
    setLoading(true);

    if (!db || !storage) {
      toast.error("Firebase no está configurado.");
      setLoading(false);
      return;
    }

    try {
      // Validar límite de 6 coches destacados
      // Solo validar si se está intentando marcar como destacado (y no lo estaba antes)
      const isTryingToFeature = formData.featured === true;
      const wasAlreadyFeatured = originalFeatured === true;
      
      if (isTryingToFeature && !wasAlreadyFeatured) {
        // Contar coches destacados actuales
        try {
          const featuredQuery = query(
            collection(db, 'cars'),
            where('featured', '==', true)
          );
          const featuredSnapshot = await getDocs(featuredQuery);
          const featuredCount = featuredSnapshot.docs.filter(
            doc => id ? doc.id !== id : true // Excluir el coche actual si es edición
          ).length;
          
          if (featuredCount >= 6) {
            toast.error(
              "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
              { duration: 4000 }
            );
            setLoading(false);
            return;
          }
        } catch (queryError: any) {
          // Si la consulta falla (por ejemplo, falta índice), intentar contar manualmente
          console.warn("Error en consulta de destacados, contando manualmente:", queryError);
          const allCarsSnapshot = await getDocs(collection(db, 'cars'));
          const featuredCount = allCarsSnapshot.docs.filter(
            doc => {
              const data = doc.data();
              return data.featured === true && (id ? doc.id !== id : true);
            }
          ).length;
          
          if (featuredCount >= 6) {
            toast.error(
              "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
              { duration: 4000 }
            );
            setLoading(false);
            return;
          }
        }
      }

      // Las imágenes ya están subidas automáticamente, solo usar imageUrls
      const carData = {
        ...formData,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, 'cars', id), carData);
        toast.success('Vehículo actualizado correctamente');
      } else {
        await addDoc(collection(db, 'cars'), {
          ...carData,
          createdAt: serverTimestamp(),
        });
        toast.success('Vehículo añadido correctamente');
      }
      navigate('/admin/cars');
    } catch (error: any) {
      console.error("Error saving car:", error);
      toast.error('Error al guardar el vehículo: ' + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCar();
  };

  // Auto-guardado cuando volvemos desde la vista de preview con flag
  useEffect(() => {
    const state = location.state as any;
    if (state?.autoSave && !loading && !uploading) {
      // Limpiar el flag para evitar loops si el usuario vuelve atrás otra vez
      navigate(location.pathname, { replace: true, state: { ...state, autoSave: false } });
      saveCar();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full min-w-0">
      <Card className="h-full flex flex-col min-w-0 bg-[#1a1a1a] border-[#2a2a2a]">
        <CardHeader className="px-6 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <CardTitle className="text-lg text-white">{id ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4 flex-1 overflow-y-auto overflow-x-auto min-w-0">
          <form onSubmit={handleSubmit} className="space-y-4 min-w-fit">
            {/* Información Básica */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-white">Información Básica</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Marca</label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Modelo</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Año</label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Precio (€)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Km</label>
                  <Input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Combustible</label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                  >
                    <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <SelectItem value="Gasoline" className="text-white hover:bg-[#2a2a2a]">Gasolina</SelectItem>
                      <SelectItem value="Diesel" className="text-white hover:bg-[#2a2a2a]">Diésel</SelectItem>
                      <SelectItem value="Electric" className="text-white hover:bg-[#2a2a2a]">Eléctrico</SelectItem>
                      <SelectItem value="Hybrid" className="text-white hover:bg-[#2a2a2a]">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Transmisión</label>
                  <Input
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    placeholder="7-Speed PDK"
                    required
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Estado</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <SelectItem value="available" className="text-white hover:bg-[#2a2a2a]">Disponible</SelectItem>
                      <SelectItem value="reserved" className="text-white hover:bg-[#2a2a2a]">Reservado</SelectItem>
                      <SelectItem value="sold" className="text-white hover:bg-[#2a2a2a]">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Categoría</label>
                  <Select
                    value={formData.category || 'luxury'}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <SelectItem value="luxury" className="text-white hover:bg-[#2a2a2a]">Lujo</SelectItem>
                      <SelectItem value="premium" className="text-white hover:bg-[#2a2a2a]">Premium</SelectItem>
                      <SelectItem value="suv" className="text-white hover:bg-[#2a2a2a]">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Descripción y Destacado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold mb-2 text-white">Descripción</h3>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Descripción detallada del vehículo..."
                  className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">Destacado</h3>
                <div className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] p-3 bg-[#0a0a0a]">
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="featured" className="text-xs font-medium cursor-pointer text-gray-200">
                      Coche Destacado
                    </Label>
                    {!formData.featured && featuredCount >= 6 && (
                      <p className="text-[10px] text-orange-400 mt-0.5">
                        Máx. 6 ({featuredCount}/6)
                      </p>
                    )}
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => {
                      if (checked && featuredCount >= 6 && !originalFeatured) {
                        toast.error(
                          "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
                          { duration: 4000 }
                        );
                        return;
                      }
                      setFormData({ ...formData, featured: checked });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Especificaciones Técnicas */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-white">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">V. Máx. (km/h)</label>
                  <Input
                    type="number"
                    value={formData.topSpeed || ''}
                    onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="320"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Potencia (hp)</label>
                  <Input
                    type="number"
                    value={formData.power || ''}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="650"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">0-100 km/h (s)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acceleration || ''}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="3.2"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Asientos</label>
                  <Input
                    type="number"
                    value={formData.seats || ''}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="2"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Color Ext.</label>
                  <Input
                    value={formData.exterior || ''}
                    onChange={(e) => setFormData({ ...formData, exterior: e.target.value })}
                    placeholder="Arctic Grey"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Color Int.</label>
                  <Input
                    value={formData.interior || ''}
                    onChange={(e) => setFormData({ ...formData, interior: e.target.value })}
                    placeholder="Black Alcantara"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Tracción</label>
                  <Select
                    value={formData.drivetrain || ''}
                    onValueChange={(value) => setFormData({ ...formData, drivetrain: value })}
                  >
                    <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <SelectItem value="RWD" className="text-white hover:bg-[#2a2a2a]">RWD</SelectItem>
                      <SelectItem value="FWD" className="text-white hover:bg-[#2a2a2a]">FWD</SelectItem>
                      <SelectItem value="AWD" className="text-white hover:bg-[#2a2a2a]">AWD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-200">Motor</label>
                  <Input
                    value={formData.engine || ''}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    placeholder="4.0L Twin-Turbo V8"
                    className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-white">Imágenes</h3>
              <p className="text-xs text-gray-400 mb-3">
                Primera imagen = principal. Reordenar arrastrando. Se suben automáticamente.
              </p>
              {uploading && (
                <div className="mb-4 flex items-center gap-2 text-sm text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subiendo imágenes...</span>
                </div>
              )}
              <FileUpload
                value={images}
                onValueChange={handleImageChange}
                multiple
                accept="image/*"
                className="w-full"
                disabled={uploading}
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1 text-center py-8">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      {uploading ? (
                        <Loader2 className="size-6 text-muted-foreground animate-spin" />
                      ) : (
                        <Upload className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-sm">
                      {uploading ? 'Subiendo imágenes...' : 'Arrastra y suelta imágenes aquí'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {uploading ? 'Por favor espera...' : 'O haz clic para buscar archivos. Se subirán automáticamente.'}
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit mx-auto border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]" disabled={uploading}>
                      {uploading ? 'Subiendo...' : 'Buscar archivos'}
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                {images.length > 0 && (
                  <FileUploadList className="mt-4">
                    {images.map((file, index) => (
                      <FileUploadItem key={`${file.name}-${file.size}-${index}`} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button variant="ghost" size="icon" className="size-7" disabled={uploading}>
                            <X />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                )}
              </FileUpload>

              {/* Imágenes existentes */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`relative group border border-[#2a2a2a] rounded-lg p-2 bg-[#0a0a0a] ${
                        draggedIndex === index ? "opacity-75 ring-2 ring-white/40" : ""
                      }`}
                      draggable
                      onDragStart={() => handleImageDragStart(index)}
                      onDragOver={handleImageDragOver}
                      onDrop={() => handleImageDrop(index)}
                      onDragEnd={handleImageDragEnd}
                    >
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            Principal
                          </div>
                        )}
                        <AlertDialog open={deleteImageDialogOpen && imageToDeleteIndex === index} onOpenChange={setDeleteImageDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleRemoveImageClick(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">¿Eliminar imagen?</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Esta acción eliminará la imagen permanentemente. ¿Estás seguro de que deseas continuar?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setImageToDeleteIndex(null)} className="bg-[#2a2a2a] border-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a]">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={removeImage}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="flex justify-center gap-1 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setHeroImage(index)}
                          disabled={index === 0}
                          className="text-xs h-8 px-2"
                        >
                          <Star className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageDown(index)}
                          disabled={index === imageUrls.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, "_blank")}
                          className="h-8 px-2 text-xs"
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Previsualización de nuevas imágenes */}
              {imagePreviews.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-gray-300">
                    Nuevas imágenes (pendientes de guardar):
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <img
                          src={url}
                          alt={`Nueva ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-7"
                          onClick={() => window.open(url, "_blank")}
                        >
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviewPage}
                className="border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]"
              >
                Vista Previa
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/cars')}
                  className="border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={loading || uploading}
                  className="min-w-[120px]"
                >
                  {loading || uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploading ? 'Subiendo...' : 'Guardando...'}
                    </>
                  ) : (
                    'Guardar Vehículo'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarForm;
