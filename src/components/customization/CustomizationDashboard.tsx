import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomization } from '@/hooks/useCustomization';
import { Upload, X, Palette, Type, RotateCcw } from 'lucide-react';
import { useState, useRef } from 'react';
import { Separator } from '@/components/ui/separator';

export const CustomizationDashboard = () => {
  const { 
    settings, 
    loading, 
    uploading, 
    fontOptions, 
    updateSettings, 
    uploadLogo, 
    deleteLogo, 
    resetToDefaults 
  } = useCustomization();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewColors, setPreviewColors] = useState({
    primary: settings?.primary_color || '#3B82F6',
    secondary: settings?.secondary_color || '#1E40AF'
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB');
      return;
    }

    await uploadLogo(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    setPreviewColors(prev => ({ ...prev, [type]: color }));
  };

  const applyColors = () => {
    updateSettings({
      primary_color: previewColors.primary,
      secondary_color: previewColors.secondary
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-muted animate-pulse rounded"></div>
          <div className="h-96 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhuma configuração de personalização encontrada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Personalização</h2>
          <p className="text-muted-foreground">
            Customize a aparência do seu restaurante
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefaults}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar Padrões
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Logo da Empresa
            </CardTitle>
            <CardDescription>
              Faça upload do logo do seu restaurante para personalizar a marca.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo_url ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted rounded-lg">
                  <img 
                    src={settings.logo_url} 
                    alt="Logo do restaurante" 
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Enviando...' : 'Trocar Logo'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={deleteLogo}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Clique para fazer upload do logo<br />
                    <span className="text-xs">PNG, JPG, WebP até 5MB</span>
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? 'Enviando...' : 'Selecionar Logo'}
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Color Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Cores do Template
            </CardTitle>
            <CardDescription>
              Personalize as cores principais do seu restaurante.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={previewColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={previewColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={previewColors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={previewColors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    placeholder="#1E40AF"
                    className="flex-1"
                  />
                </div>
              </div>

              <Button onClick={applyColors} className="w-full">
                Aplicar Cores
              </Button>
            </div>

            <Separator />

            {/* Color Preview */}
            <div className="space-y-2">
              <Label>Prévia das Cores</Label>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  className="h-12 rounded border flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: previewColors.primary }}
                >
                  Primária
                </div>
                <div 
                  className="h-12 rounded border flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: previewColors.secondary }}
                >
                  Secundária
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Tipografia
            </CardTitle>
            <CardDescription>
              Escolha a fonte principal do seu restaurante.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-family">Família da Fonte</Label>
              <Select
                value={settings.font_family}
                onValueChange={(value) => updateSettings({ font_family: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prévia da Fonte</Label>
              <div 
                className="p-4 border rounded text-center"
                style={{ fontFamily: settings.font_family }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {settings.name}
                </h3>
                <p className="text-muted-foreground">
                  A fonte selecionada será aplicada em todo o sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Template</CardTitle>
            <CardDescription>
              Veja como as personalizações ficam aplicadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 border rounded-lg"
              style={{ 
                fontFamily: settings.font_family,
                background: `linear-gradient(135deg, ${previewColors.primary}15, ${previewColors.secondary}15)`
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {settings.logo_url && (
                  <img 
                    src={settings.logo_url} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold">{settings.name}</h3>
                  <p className="text-sm text-muted-foreground">Restaurante</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  style={{ backgroundColor: previewColors.primary }}
                  className="text-white"
                >
                  Botão Primário
                </Button>
                <Button 
                  variant="outline"
                  style={{ 
                    borderColor: previewColors.secondary,
                    color: previewColors.secondary 
                  }}
                >
                  Botão Secundário
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};