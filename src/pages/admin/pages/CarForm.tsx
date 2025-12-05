import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCarForm } from "@/hooks/useCarForm";
import { BasicInfoFields } from "../features/car-form/components/BasicInfoFields";
import { DescriptionAndFeatured } from "../features/car-form/components/DescriptionAndFeatured";
import { TechnicalSpecs } from "../features/car-form/components/TechnicalSpecs";
import { ImageGallery } from "../features/car-form/components/ImageGallery";
import { FormActions } from "../features/car-form/components/FormActions";

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
    <div className="w-full min-w-0">
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardHeader className="px-6 py-4 border-b border-[#2a2a2a]">
          <CardTitle className="text-lg text-white">
            {id ? "Editar Vehículo" : "Añadir Nuevo Vehículo"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            style={{ minHeight: 0 }}
          >
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
