import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const {
    seoSettings,
    homepageSettings,
    loading,
    saving,
    updateSEOSettings,
    updateHomepageSettings,
  } = useSiteSettings();

  const [seoFormData, setSeoFormData] = useState(seoSettings);
  const [homepageFormData, setHomepageFormData] = useState(homepageSettings);

  // Actualizar formularios cuando se cargan los datos
  useEffect(() => {
    if (!loading) {
      setSeoFormData(seoSettings);
      setHomepageFormData(homepageSettings);
    }
  }, [seoSettings, homepageSettings, loading]);

  const handleSEOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSEOSettings(seoFormData);
  };

  const handleHomepageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepageSettings(homepageFormData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
          Ajustes de Página
        </h2>
      </div>

      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 bg-[#1a1a1a] border border-[#2a2a2a] p-1">
          <TabsTrigger 
            value="seo" 
            className="text-xs sm:text-sm data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white text-gray-400 h-full"
          >
            SEO
          </TabsTrigger>
          <TabsTrigger 
            value="homepage"
            className="text-xs sm:text-sm data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white text-gray-400 h-full"
          >
            Inicio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="mt-4">
          {/* Configuración SEO */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
              <CardTitle className="text-white text-base sm:text-lg">Configuración SEO</CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Gestiona los metadatos y configuración SEO del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 py-4">
              <form onSubmit={handleSEOSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteTitle" className="text-white text-xs font-medium">
                      Título del Sitio
                    </Label>
                    <Input
                      id="siteTitle"
                      value={seoFormData.siteTitle}
                      onChange={(e) => setSeoFormData({ ...seoFormData, siteTitle: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="AutoHaus - Concesionario de Vehículos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogSiteName" className="text-white text-xs font-medium">
                      Nombre del Sitio (OG)
                    </Label>
                    <Input
                      id="ogSiteName"
                      value={seoFormData.ogSiteName}
                      onChange={(e) => setSeoFormData({ ...seoFormData, ogSiteName: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="AutoHaus"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="siteDescription" className="text-white text-xs font-medium">
                      Meta Descripción
                    </Label>
                    <Textarea
                      id="siteDescription"
                      value={seoFormData.siteDescription}
                      onChange={(e) => setSeoFormData({ ...seoFormData, siteDescription: e.target.value })}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-[80px] text-sm resize-none"
                      placeholder="Descripción del sitio para motores de búsqueda..."
                      rows={3}
                    />
                    <p className="text-[10px] text-gray-400 text-right">
                      {seoFormData.siteDescription.length}/160 caracteres
                    </p>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="keywords" className="text-white text-xs font-medium">
                      Palabras Clave
                    </Label>
                    <Input
                      id="keywords"
                      value={seoFormData.keywords}
                      onChange={(e) => setSeoFormData({ ...seoFormData, keywords: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="concesionario, coches, vehículos..."
                    />
                    <p className="text-[10px] text-gray-400">Separa las palabras clave con comas</p>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="ogImageUrl" className="text-white text-xs font-medium">
                      URL de Imagen Open Graph
                    </Label>
                    <Input
                      id="ogImageUrl"
                      value={seoFormData.ogImageUrl}
                      onChange={(e) => setSeoFormData({ ...seoFormData, ogImageUrl: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="https://autohaus.es/images/logo/autohaus.png"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="canonicalUrl" className="text-white text-xs font-medium">
                      URL Canónica
                    </Label>
                    <Input
                      id="canonicalUrl"
                      value={seoFormData.canonicalUrl}
                      onChange={(e) => setSeoFormData({ ...seoFormData, canonicalUrl: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="https://autohaus.es/"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
                  <Button
                    type="submit"
                    disabled={saving}
                    size="sm"
                    className="h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage" className="mt-4">
          {/* Configuración de Página de Inicio */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
              <CardTitle className="text-white text-base sm:text-lg">Página de Inicio</CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Personaliza el contenido y las secciones de la página principal
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 py-4">
              <form onSubmit={handleHomepageSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle" className="text-white text-xs font-medium">
                      Título del Hero
                    </Label>
                    <Input
                      id="heroTitle"
                      value={homepageFormData.heroTitle}
                      onChange={(e) => setHomepageFormData({ ...homepageFormData, heroTitle: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="Tu concesionario de confianza"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredCarsCount" className="text-white text-xs font-medium">
                      Coches Destacados
                    </Label>
                    <Input
                      id="featuredCarsCount"
                      type="number"
                      min="1"
                      max="12"
                      value={homepageFormData.featuredCarsCount}
                      onChange={(e) => setHomepageFormData({ ...homepageFormData, featuredCarsCount: parseInt(e.target.value) || 6 })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                    />
                    <p className="text-[10px] text-gray-400">Número a mostrar (1-12)</p>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="heroSubtitle" className="text-white text-xs font-medium">
                      Subtítulo del Hero
                    </Label>
                    <Textarea
                      id="heroSubtitle"
                      value={homepageFormData.heroSubtitle}
                      onChange={(e) => setHomepageFormData({ ...homepageFormData, heroSubtitle: e.target.value })}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-[80px] text-sm resize-none"
                      placeholder="Descubre una selección exclusiva..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="heroImageUrl" className="text-white text-xs font-medium">
                      URL de Imagen del Hero
                    </Label>
                    <Input
                      id="heroImageUrl"
                      value={homepageFormData.heroImageUrl}
                      onChange={(e) => setHomepageFormData({ ...homepageFormData, heroImageUrl: e.target.value })}
                      className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="/images/UI/hero.png"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white text-sm font-semibold">Secciones Habilitadas</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { id: 'trustedBrands', label: 'Marcas' },
                      { id: 'featuredVehicles', label: 'Destacados' },
                      { id: 'whyChoose', label: 'Por Qué' },
                      { id: 'stats', label: 'Estadísticas' },
                      { id: 'reviews', label: 'Reseñas' },
                      { id: 'faq', label: 'FAQ' },
                    ].map((section) => (
                      <div key={section.id} className="flex flex-col items-center justify-between p-3 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] gap-3 hover:border-gray-700 transition-colors">
                        <Label htmlFor={section.id} className="text-gray-300 text-xs font-medium cursor-pointer text-center">
                          {section.label}
                        </Label>
                        <Switch
                          id={section.id}
                          checked={homepageFormData.sectionsEnabled[section.id as keyof typeof homepageFormData.sectionsEnabled]}
                          onCheckedChange={(checked) =>
                            setHomepageFormData({
                              ...homepageFormData,
                              sectionsEnabled: {
                                ...homepageFormData.sectionsEnabled,
                                [section.id]: checked,
                              },
                            })
                          }
                          className="scale-90 data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
                  <Button
                    type="submit"
                    disabled={saving}
                    size="sm"
                    className="h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
