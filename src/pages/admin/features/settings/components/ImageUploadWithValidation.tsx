import { Loader2, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUploadWithValidation, ImageValidation } from "../hooks/useImageUploadWithValidation";

interface ImageUploadWithValidationProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  folder: string;
  validation: ImageValidation;
  accept?: string;
}

export const ImageUploadWithValidation = ({
  value,
  onChange,
  label,
  description,
  folder,
  validation,
  accept = "image/*",
}: ImageUploadWithValidationProps) => {
  const {
    uploading,
    preview,
    validationError,
    fileInputRef,
    handleFileSelect,
    handleRemove,
  } = useImageUploadWithValidation(folder, validation, onChange);

  return (
    <div className="space-y-2">
      <Label className="text-white text-xs font-medium">{label}</Label>
      {description && (
        <p className="text-[10px] text-gray-400">{description}</p>
      )}

      <div className="flex flex-col gap-3">
        {/* Preview de imagen actual o nueva */}
        {(value || preview) && (
          <div className="relative inline-block">
            <div className="relative w-full max-w-xs border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#0a0a0a]">
              <img
                src={preview || value}
                alt="Preview"
                className="w-full h-auto max-h-48 object-contain"
              />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  aria-label="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {preview && uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
          </div>
        )}

        {/* Input de archivo */}
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Mensaje de error de validación */}
        {validationError && (
          <div className="flex items-start gap-2 p-2 bg-red-900/20 border border-red-800 rounded text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Información de requisitos */}
        <div className="text-[10px] text-gray-500 space-y-1">
          <p className="font-medium text-gray-400">Requisitos:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            {validation.exactWidth && validation.exactHeight && (
              <li>
                Dimensiones exactas: {validation.exactWidth}x
                {validation.exactHeight}px
              </li>
            )}
            {validation.minWidth && validation.minHeight && (
              <li>
                Mínimo: {validation.minWidth}x{validation.minHeight}px
              </li>
            )}
            {validation.maxWidth && validation.maxHeight && (
              <li>
                Máximo: {validation.maxWidth}x{validation.maxHeight}px
              </li>
            )}
            {validation.square && <li>Debe ser cuadrada (ancho = alto)</li>}
            {validation.aspectRatio && (
              <li>
                Relación de aspecto: {validation.aspectRatio.toFixed(2)}:1
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

