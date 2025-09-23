import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomization } from '@/hooks/useCustomization';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface LogoCarouselProps {
  className?: string;
}

export const LogoCarousel = ({ className }: LogoCarouselProps) => {
  const { settings } = useCustomization();

  // Sample carousel items - in a real app, these could be fetched from a database
  const carouselItems = [
    {
      id: 'restaurant-logo',
      type: 'logo',
      title: settings?.name || 'Seu Restaurante',
      description: 'Logo da empresa',
      imageUrl: settings?.logo_url,
    },
    {
      id: 'featured-dish-1',
      type: 'dish',
      title: 'Prato Especial',
      description: 'Especialidade da casa',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'featured-dish-2',
      type: 'dish',
      title: 'Sobremesa',
      description: 'Doce tradicional',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ambiente',
      type: 'ambience',
      title: 'Ambiente',
      description: 'Nosso espaço acolhedor',
      imageUrl: '/placeholder.svg',
    }
  ];

  return (
    <div className={className}>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="relative aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    {item.type === 'logo' && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2"
                      >
                        Logo
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};