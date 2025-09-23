import { CustomizationDashboard } from '@/components/customization/CustomizationDashboard';
import { LogoCarousel } from '@/components/customization/LogoCarousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Upload, Eye } from 'lucide-react';

export default function Customization() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Personalização do Restaurante
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Customize a aparência do seu restaurante com cores, fontes e logo personalizado.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <Upload className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Upload de Logo</CardTitle>
            <CardDescription>
              Faça upload do logo da sua empresa para personalizar a marca
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Palette className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Cores Personalizadas</CardTitle>
            <CardDescription>
              Escolha as cores que representam a identidade visual do seu negócio
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Eye className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Prévia em Tempo Real</CardTitle>
            <CardDescription>
              Veja as mudanças aplicadas instantaneamente em todo o sistema
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Logo Carousel Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria com Logo Integrado</CardTitle>
          <CardDescription>
            Seu logo será automaticamente inserido no carrossel de imagens do restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoCarousel />
        </CardContent>
      </Card>

      {/* Main Customization Dashboard */}
      <CustomizationDashboard />
    </div>
  );
}