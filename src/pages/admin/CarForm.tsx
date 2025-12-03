import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCarForm } from "@/hooks/useCarForm";
import { BasicInfoFields } from "./CarForm/components/BasicInfoFields";
import { DescriptionAndFeatured } from "./CarForm/components/DescriptionAndFeatured";
import { TechnicalSpecs } from "./CarForm/components/TechnicalSpecs";
import { ImageGallery } from "./CarForm/components/ImageGallery";
import { FormActions } from "./CarForm/components/FormActions";

const CarForm = () => {
  const {
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
  } = useCarForm();

  return (
    <div
      className="w-full min-w-0 flex flex-col"
      style={{ height: "100%", maxHeight: "100%" }}
    >
      <Card
        className="flex flex-col min-w-0 bg-[#1a1a1a] border-[#2a2a2a] h-full"
        style={{ maxHeight: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardHeader className="px-6 py-3 border-b border-[#2a2a2a] flex-shrink-0">
          <CardTitle className="text-lg text-white">
            {id ? "Editar Vehículo" : "Añadir Nuevo Vehículo"}
          </CardTitle>
        </CardHeader>
        <CardContent
          className="px-6 py-3 flex-1 overflow-y-auto overflow-x-auto min-w-0"
          style={{ minHeight: 0, maxHeight: "100%" }}
          onWheel={(e) => {
            const element = e.currentTarget;
            if (element.scrollHeight > element.clientHeight) {
              element.scrollTop += e.deltaY;
              e.preventDefault();
            }
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-3 min-w-fit">
            <BasicInfoFields
              formData={formData}
              setFormData={setFormData}
              featuredCount={featuredCount}
              originalFeatured={originalFeatured}
            />

            <DescriptionAndFeatured
              formData={formData}
              setFormData={setFormData}
              featuredCount={featuredCount}
              originalFeatured={originalFeatured}
            />

            <TechnicalSpecs formData={formData} setFormData={setFormData} />

            <ImageGallery
              images={images}
              imageUrls={imageUrls}
              imagePreviews={imagePreviews}
              draggedIndex={draggedIndex}
              uploading={uploading}
              deleteImageDialogOpen={deleteImageDialogOpen}
              imageToDeleteIndex={imageToDeleteIndex}
              handleImageChange={handleImageChange}
              handleRemoveImageClick={handleRemoveImageClick}
              removeImage={removeImage}
              setHeroImage={setHeroImage}
              moveImageUp={moveImageUp}
              moveImageDown={moveImageDown}
              handleImageDragStart={handleImageDragStart}
              handleImageDragOver={handleImageDragOver}
              handleImageDrop={handleImageDrop}
              handleImageDragEnd={handleImageDragEnd}
              setDeleteImageDialogOpen={setDeleteImageDialogOpen}
            />

            <FormActions
              loading={loading}
              uploading={uploading}
              onPreview={handlePreviewPage}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarForm;
