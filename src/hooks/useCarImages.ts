import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

export const useCarImages = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);

  const handleImageChange = async (allFiles: File[]) => {
    if (!storage) {
      toast.error("Firebase Storage no está configurado.");
      return;
    }

    // Identificar archivos nuevos (que no están en el estado actual)
    const existingFilesSet = new Set(
      images.map((f) => `${f.name}-${f.size}-${f.lastModified}`)
    );
    const newFiles = allFiles.filter(
      (file) =>
        !existingFilesSet.has(`${file.name}-${file.size}-${file.lastModified}`)
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
        setImageUrls((prev) => [...prev, ...uploadedUrls]);

        // Limpiar las previews temporales de los archivos subidos
        newFiles.forEach((file) => {
          const previewIndex = imagePreviews.findIndex((_, idx) => {
            const oldFile = images[idx];
            return (
              oldFile &&
              oldFile.name === file.name &&
              oldFile.size === file.size
            );
          });
          if (previewIndex >= 0) {
            URL.revokeObjectURL(imagePreviews[previewIndex]);
          }
        });

        // Limpiar el estado de imágenes para que el componente FileUpload se vacíe
        setImages([]);
        setImagePreviews([]);

        toast.success(
          `${newFiles.length} imagen${newFiles.length > 1 ? "es" : ""} subida${
            newFiles.length > 1 ? "s" : ""
          } correctamente`
        );
      } catch (error: any) {
        console.error("Error subiendo imágenes:", error);
        toast.error(`Error al subir imágenes: ${error.message}`);
        setImages(allFiles);
      } finally {
        setUploading(false);
      }
    } else {
      setImages(allFiles);
    }
  };

  const handleRemoveImageClick = (index: number) => {
    setImageToDeleteIndex(index);
    setDeleteImageDialogOpen(true);
  };

  const removeImage = () => {
    if (imageToDeleteIndex === null) return;
    setImageUrls((prev) => prev.filter((_, i) => i !== imageToDeleteIndex));
    setDeleteImageDialogOpen(false);
    setImageToDeleteIndex(null);
    toast.success("Imagen eliminada");
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setImageUrls((prev) => {
      const newUrls = [...prev];
      [newUrls[index - 1], newUrls[index]] = [
        newUrls[index],
        newUrls[index - 1],
      ];
      return newUrls;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return;
    setImageUrls((prev) => {
      const newUrls = [...prev];
      [newUrls[index], newUrls[index + 1]] = [
        newUrls[index + 1],
        newUrls[index],
      ];
      return newUrls;
    });
  };

  const setHeroImage = (index: number) => {
    setImageUrls((prev) => {
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
    setImageUrls((prev) => {
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

  return {
    images,
    imageUrls,
    imagePreviews,
    draggedIndex,
    uploading,
    deleteImageDialogOpen,
    imageToDeleteIndex,
    setImages,
    setImageUrls,
    setImagePreviews,
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
  };
};

