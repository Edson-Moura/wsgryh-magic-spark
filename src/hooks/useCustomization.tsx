import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CustomizationSettings {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Poppins', label: 'Poppins (Friendly)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
  { value: 'Open Sans', label: 'Open Sans (Classic)' }
];

export const useCustomization = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CustomizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's restaurant
      const { data: memberData, error: memberError } = await supabase
        .from('restaurant_members')
        .select('restaurant_id, restaurants(*)')
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        console.error('Error fetching restaurant:', memberError);
        return;
      }

      if (memberData?.restaurants) {
        setSettings(memberData.restaurants as CustomizationSettings);
      }
    } catch (error) {
      console.error('Error fetching customization settings:', error);
      toast.error('Erro ao carregar configurações de personalização');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<CustomizationSettings>) => {
    if (!settings || !user) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Configurações atualizadas com sucesso!');
      
      // Apply changes to document root for immediate effect
      applyThemeToDocument({ ...settings, ...updates });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user || !settings) return null;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('restaurant-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('restaurant-assets')
        .getPublicUrl(fileName);

      // Update restaurant with new logo URL
      await updateSettings({ logo_url: publicUrl });
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao fazer upload do logo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteLogo = async () => {
    if (!settings?.logo_url || !user) return;

    try {
      // Extract file path from URL
      const url = new URL(settings.logo_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('restaurant-assets')
          .remove([`${user.id}/${filePath}`]);

        if (deleteError) throw deleteError;
      }

      // Update restaurant to remove logo URL
      await updateSettings({ logo_url: null });
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error('Erro ao remover logo');
    }
  };

  const applyThemeToDocument = (theme: CustomizationSettings) => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply colors
    root.style.setProperty('--primary', hexToHsl(theme.primary_color));
    root.style.setProperty('--secondary', hexToHsl(theme.secondary_color));
    
    // Apply font family
    root.style.setProperty('--font-family', theme.font_family);
    document.body.style.fontFamily = theme.font_family;
  };

  const resetToDefaults = async () => {
    const defaults = {
      primary_color: '#3B82F6',
      secondary_color: '#1E40AF',
      font_family: 'Inter'
    };
    
    await updateSettings(defaults);
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  // Apply theme when settings change
  useEffect(() => {
    if (settings) {
      applyThemeToDocument(settings);
    }
  }, [settings]);

  return {
    settings,
    loading,
    uploading,
    fontOptions: FONT_OPTIONS,
    updateSettings,
    uploadLogo,
    deleteLogo,
    resetToDefaults,
    refetch: fetchSettings
  };
};