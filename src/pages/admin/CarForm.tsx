import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
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
import { toast } from 'sonner';
import { Loader2, X, Upload, ArrowUp, ArrowDown, Star } from 'lucide-react';

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Crear URLs temporales para previsualización
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
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

  const uploadImages = async () => {
    const urls: string[] = [];
    for (const image of images) {
      const storageRef = ref(storage, `cars/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
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
      let newImageUrls = [...imageUrls];
      
      if (images.length > 0) {
        setUploading(true);
        const uploadedUrls = await uploadImages();
        newImageUrls = [...newImageUrls, ...uploadedUrls];
        setUploading(false);
      }

      const carData = {
        ...formData,
        images: newImageUrls,
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
    <div className="max-w-4xl mx-auto pb-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Marca</label>
                <Input
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo</label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Año</label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio (€)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kilometraje (km)</label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Combustible</label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasolina</SelectItem>
                    <SelectItem value="Diesel">Diésel</SelectItem>
                    <SelectItem value="Electric">Eléctrico</SelectItem>
                    <SelectItem value="Hybrid">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmisión</label>
                <Input
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  placeholder="Ej: 7-Speed PDK, 6-Speed Manual, Automática"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={formData.category || 'luxury'}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Lujo</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Especificaciones Técnicas */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Especificaciones Clave</h3>
              <p className="text-sm text-gray-600 mb-4">
                Una descripción detallada de las especificaciones técnicas clave y los principales aspectos destacados de rendimiento del vehículo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Velocidad Máxima (km/h)</label>
                  <Input
                    type="number"
                    value={formData.topSpeed || ''}
                    onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ej: 320"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potencia (hp)</label>
                  <Input
                    type="number"
                    value={formData.power || ''}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ej: 650"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aceleración 0-100 km/h (s)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acceleration || ''}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Ej: 3.2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asientos</label>
                  <Input
                    type="number"
                    value={formData.seats || ''}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ej: 2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exterior</label>
                  <Input
                    value={formData.exterior || ''}
                    onChange={(e) => setFormData({ ...formData, exterior: e.target.value })}
                    placeholder="Ej: Arctic Grey"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interior</label>
                  <Input
                    value={formData.interior || ''}
                    onChange={(e) => setFormData({ ...formData, interior: e.target.value })}
                    placeholder="Ej: Black Alcantara"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tracción</label>
                  <Select
                    value={formData.drivetrain || ''}
                    onValueChange={(value) => setFormData({ ...formData, drivetrain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tracción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RWD">RWD (Tracción trasera)</SelectItem>
                      <SelectItem value="FWD">FWD (Tracción delantera)</SelectItem>
                      <SelectItem value="AWD">AWD (Tracción total)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motor</label>
                  <Input
                    value={formData.engine || ''}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    placeholder="Ej: 4.0 L Twin-Turbo V8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2 border-t pt-6">
              <label className="text-sm font-medium">Imágenes</label>
              <p className="text-xs text-gray-500 mb-2">
                La primera imagen será la imagen principal (hero). Puedes reordenar usando los botones.
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>

              {/* Imágenes existentes (guardadas en Firebase) */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`relative group border rounded-lg p-2 bg-gray-50 ${
                        draggedIndex === index ? "opacity-75 ring-2 ring-black/40" : ""
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
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setHeroImage(index)}
                          disabled={index === 0}
                          className="text-xs"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Principal
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageDown(index)}
                          disabled={index === imageUrls.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, "_blank")}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Previsualización de nuevas imágenes seleccionadas (local) */}
              {imagePreviews.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-medium text-gray-600">
                    Nuevas imágenes seleccionadas (aún no guardadas):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="space-y-1">
                        <img
                          src={url}
                          alt={`Nueva imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => window.open(url, "_blank")}
                        >
                          Vista previa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewPage}
                className="w-full sm:w-auto"
              >
                Vista previa ficha
              </Button>
              <div className="flex gap-3 sm:gap-4 justify-end w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/cars')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  {loading || uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploading ? 'Subiendo Imágenes...' : 'Guardando...'}
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
