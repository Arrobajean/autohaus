import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { toast } from "sonner";
import { getDefaultCarFormData, createPreviewCar, validateCarForm } from "@/pages/admin/helpers/carFormHelpers";
import { validateFeaturedLimit } from "@/pages/admin/helpers/carValidation";
import { useCarImages } from "./useCarImages";
import { useFeaturedCount } from "./useFeaturedCount";

export const useCarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Car>>(getDefaultCarFormData());
  const [originalFeatured, setOriginalFeatured] = useState(false);

  const featuredCount = useFeaturedCount(id);
  const {
    images,
    imageUrls,
    imagePreviews,
    draggedIndex,
    uploading,
    deleteImageDialogOpen,
    imageToDeleteIndex,
    setImageUrls,
    setDeleteImageDialogOpen,
    handleImageChange,
    handleRemoveImageClick,
    removeImage,
    moveImageUp,
    moveImageDown,
    setHeroImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
  } = useCarImages();

  // Cargar datos del coche si es edición
  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        if (!db) return;
        try {
          const docRef = doc(db, "cars", id);
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
  }, [id, setImageUrls]);

  const handlePreviewPage = () => {
    const validation = validateCarForm(formData);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const fakeCar = createPreviewCar(formData, imageUrls, imagePreviews, id);
    const returnTo = id ? `/admin/cars/${id}` : "/admin/cars/new";
    navigate("/preview/coche", { state: { car: fakeCar, returnTo } });
  };

  const saveCar = async () => {
    setLoading(true);

    if (!db) {
      toast.error("Firebase no está configurado.");
      setLoading(false);
      return;
    }

    try {
      const isTryingToFeature = formData.featured === true;
      const wasAlreadyFeatured = originalFeatured === true;

      const isValid = await validateFeaturedLimit(
        id,
        isTryingToFeature,
        wasAlreadyFeatured
      );

      if (!isValid) {
        setLoading(false);
        return;
      }

      const carData = {
        ...formData,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "cars", id), carData);
        toast.success("Vehículo actualizado correctamente");
      } else {
        await addDoc(collection(db, "cars"), {
          ...carData,
          createdAt: serverTimestamp(),
        });
        toast.success("Vehículo añadido correctamente");
      }
      navigate("/admin/cars");
    } catch (error: any) {
      console.error("Error saving car:", error);
      toast.error("Error al guardar el vehículo: " + error.message);
    } finally {
      setLoading(false);
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
      navigate(location.pathname, {
        replace: true,
        state: { ...state, autoSave: false },
      });
      saveCar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    id,
    loading,
    uploading,
    formData,
    setFormData,
    imageUrls,
    imagePreviews,
    draggedIndex,
    deleteImageDialogOpen,
    imageToDeleteIndex,
    featuredCount,
    originalFeatured,
    images,
    handleImageChange,
    handleRemoveImageClick,
    removeImage,
    moveImageUp,
    moveImageDown,
    setHeroImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
    setDeleteImageDialogOpen,
    handlePreviewPage,
    handleSubmit,
  };
};

