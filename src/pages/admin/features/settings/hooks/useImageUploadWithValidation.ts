import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

export interface ImageValidation {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  aspectRatio?: number;
  square?: boolean;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

export const useImageUploadWithValidation = (
  folder: string,
  validation: ImageValidation,
  onChange: (url: string) => void
) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageDimensions = (
    file: File
  ): Promise<ValidationResult> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const { width, height } = img;

        // Validación de ancho exacto
        if (validation.exactWidth && width !== validation.exactWidth) {
          resolve({
            valid: false,
            error: `El ancho debe ser exactamente ${validation.exactWidth}px. Actual: ${width}px`,
            width,
            height,
          });
          return;
        }

        // Validación de alto exacto
        if (validation.exactHeight && height !== validation.exactHeight) {
          resolve({
            valid: false,
            error: `El alto debe ser exactamente ${validation.exactHeight}px. Actual: ${height}px`,
            width,
            height,
          });
          return;
        }

        // Validación de ancho mínimo
        if (validation.minWidth && width < validation.minWidth) {
          resolve({
            valid: false,
            error: `El ancho mínimo es ${validation.minWidth}px. Actual: ${width}px`,
            width,
            height,
          });
          return;
        }

        // Validación de ancho máximo
        if (validation.maxWidth && width > validation.maxWidth) {
          resolve({
            valid: false,
            error: `El ancho máximo es ${validation.maxWidth}px. Actual: ${width}px`,
            width,
            height,
          });
          return;
        }

        // Validación de alto mínimo
        if (validation.minHeight && height < validation.minHeight) {
          resolve({
            valid: false,
            error: `El alto mínimo es ${validation.minHeight}px. Actual: ${height}px`,
            width,
            height,
          });
          return;
        }

        // Validación de alto máximo
        if (validation.maxHeight && height > validation.maxHeight) {
          resolve({
            valid: false,
            error: `El alto máximo es ${validation.maxHeight}px. Actual: ${height}px`,
            width,
            height,
          });
          return;
        }

        // Validación de aspecto cuadrado
        if (validation.square && width !== height) {
          resolve({
            valid: false,
            error: `La imagen debe ser cuadrada. Actual: ${width}x${height}px`,
            width,
            height,
          });
          return;
        }

        // Validación de relación de aspecto
        if (validation.aspectRatio) {
          const actualRatio = width / height;
          const tolerance = 0.05; // 5% de tolerancia
          const expectedRatio = validation.aspectRatio;

          if (
            actualRatio < expectedRatio - tolerance ||
            actualRatio > expectedRatio + tolerance
          ) {
            resolve({
              valid: false,
              error: `La relación de aspecto debe ser ${expectedRatio.toFixed(
                2
              )}:1 (ej: 1200x630). Actual: ${width}x${height}px (${actualRatio.toFixed(
                2
              )}:1)`,
              width,
              height,
            });
            return;
          }
        }

        resolve({ valid: true, width, height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          valid: false,
          error:
            "Error al cargar la imagen. Asegúrate de que sea un archivo de imagen válido.",
        });
      };

      img.src = objectUrl;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      toast.error("Firebase Storage no está configurado.");
      return;
    }

    // Validar dimensiones
    setValidationError(null);
    const validationResult = await validateImageDimensions(file);

    if (!validationResult.valid) {
      setValidationError(validationResult.error || "Error de validación");
      toast.error(
        validationResult.error || "La imagen no cumple con los requisitos"
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Mostrar preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Subir imagen
    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onChange(url);
      toast.success("Imagen subida correctamente");
      setPreview(null);
    } catch (error: any) {
      console.error("Error subiendo imagen:", error);
      toast.error("Error al subir la imagen: " + error.message);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    uploading,
    preview,
    validationError,
    fileInputRef,
    handleFileSelect,
    handleRemove,
  };
};

