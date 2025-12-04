import { Button } from "@/components/ui/button";
import { Loader2, X, Upload, ArrowUp, ArrowDown, Star, ExternalLink } from "lucide-react";
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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

interface ImageGalleryProps {
  images: File[];
  imageUrls: string[];
  imagePreviews: string[];
  draggedIndex: number | null;
  uploading: boolean;
  deleteImageDialogOpen: boolean;
  imageToDeleteIndex: number | null;
  handleImageChange: (files: File[]) => void;
  handleRemoveImageClick: (index: number) => void;
  removeImage: () => void;
  setHeroImage: (index: number) => void;
  moveImageUp: (index: number) => void;
  moveImageDown: (index: number) => void;
  handleImageDragStart: (index: number) => void;
  handleImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleImageDrop: (index: number) => void;
  handleImageDragEnd: () => void;
  setDeleteImageDialogOpen: (open: boolean) => void;
}

export const ImageGallery = ({
  images,
  imageUrls,
  imagePreviews,
  draggedIndex,
  uploading,
  deleteImageDialogOpen,
  imageToDeleteIndex,
  handleImageChange,
  handleRemoveImageClick,
  removeImage,
  setHeroImage,
  moveImageUp,
  moveImageDown,
  handleImageDragStart,
  handleImageDragOver,
  handleImageDrop,
  handleImageDragEnd,
  setDeleteImageDialogOpen,
}: ImageGalleryProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1.5 text-white">Imágenes</h3>
      <p className="text-xs text-gray-400 mb-2">
        Primera imagen = principal. Reordenar arrastrando. Se suben automáticamente.
      </p>
      {uploading && (
        <div className="mb-2 flex items-center gap-2 text-xs text-blue-400">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Subiendo imágenes...</span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {/* Upload Button Card */}
          <FileUpload
            value={images}
            onValueChange={handleImageChange}
            multiple
            accept="image/*"
            className="col-span-1 h-full"
            disabled={uploading}
          >
            <FileUploadDropzone className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 border-dashed border-2 border-[#2a2a2a] bg-[#1a1a1a]/50 hover:bg-[#1a1a1a] hover:border-gray-500 transition-all rounded-lg cursor-pointer group">
              <div className="flex items-center justify-center rounded-full border border-[#2a2a2a] p-3 bg-[#1a1a1a] group-hover:scale-110 transition-transform mb-3">
                {uploading ? (
                  <Loader2 className="size-5 text-gray-400 animate-spin" />
                ) : (
                  <Upload className="size-5 text-gray-400" />
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="font-medium text-xs text-gray-300">
                  {uploading ? "Subiendo..." : "Añadir Imágenes"}
                </p>
                <p className="text-[10px] text-gray-500 hidden sm:block">
                  Arrastra o haz clic
                </p>
              </div>
              <FileUploadTrigger className="hidden" />
            </FileUploadDropzone>
            
            {/* Hidden file list for state management */}
            <div className="hidden">
              <FileUploadList>
                {images.map((file, index) => (
                  <FileUploadItem key={index} value={file} />
                ))}
              </FileUploadList>
            </div>
          </FileUpload>

          {/* Existing Images */}
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className={`relative group border border-[#2a2a2a] rounded-lg p-1.5 bg-[#0a0a0a] aspect-square ${
                draggedIndex === index ? "opacity-75 ring-2 ring-white/40" : ""
              }`}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={handleImageDragOver}
              onDrop={() => handleImageDrop(index)}
              onDragEnd={handleImageDragEnd}
            >
              <div className="relative w-full h-full">
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 shadow-sm z-10">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Principal
                  </div>
                )}
                <AlertDialog
                  open={deleteImageDialogOpen && imageToDeleteIndex === index}
                  onOpenChange={setDeleteImageDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleRemoveImageClick(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10"
                    >
                      <X className="w-3.5 h-3.5" />
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
                      <AlertDialogCancel
                        onClick={() => setDeleteImageDialogOpen(false)}
                        className="bg-[#2a2a2a] border-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a]"
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={removeImage}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1 rounded-b-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setHeroImage(index)}
                    disabled={index === 0}
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    title="Marcar como principal"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveImageUp(index)}
                    disabled={index === 0}
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveImageDown(index)}
                    disabled={index === imageUrls.length - 1}
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(url, "_blank")}
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    title="Ver imagen"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previsualización de nuevas imágenes */}
      {imagePreviews.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-gray-300">
            Nuevas imágenes (pendientes de guardar):
          </p>
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {imagePreviews.map((url, index) => (
              <div key={index} className="space-y-1">
                <img
                  src={url}
                  alt={`Nueva ${index + 1}`}
                  className="w-full h-16 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-[10px] h-6 bg-[#2a2a2a] border-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
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
  );
};

