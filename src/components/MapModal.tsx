import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation as NavigationIcon } from 'lucide-react';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  hospitalAddress: string;
}

const MapModal: React.FC<MapModalProps> = ({ 
  isOpen, 
  onClose, 
  hospitalName, 
  hospitalAddress 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for hospital location
      const marker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([-74.006, 40.7128])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-gray-800">${hospitalName}</h3>
              <p class="text-sm text-gray-600">${hospitalAddress}</p>
            </div>`
          )
        )
        .addTo(map.current);

      // Show popup by default
      marker.getPopup().addTo(map.current);

      setShowTokenInput(false);
      toast.success('Map loaded successfully! Note: This is a demo with sample coordinates.');
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Error loading map. Please check your Mapbox token.');
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapboxToken.trim()) {
      toast.error('Please enter your Mapbox token');
      return;
    }
    initializeMap();
  };

  const openInMaps = () => {
    const encodedAddress = encodeURIComponent(hospitalAddress);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  useEffect(() => {
    if (isOpen && !showTokenInput && mapboxToken) {
      setTimeout(initializeMap, 100);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, mapboxToken, showTokenInput]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Directions to {hospitalName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {showTokenInput ? (
            <div className="p-6 bg-blue-50 rounded-lg space-y-4">
              <div className="text-center space-y-2">
                <NavigationIcon className="w-8 h-8 text-blue-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800">Interactive Map</h3>
                <p className="text-sm text-gray-600">
                  To display an interactive map, please enter your Mapbox public token.
                  Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
                </p>
              </div>
              
              <form onSubmit={handleTokenSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter your Mapbox public token..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Load Map
                  </Button>
                  <Button type="button" variant="outline" onClick={openInMaps} className="flex-1">
                    Open in Google Maps
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div 
                ref={mapContainer} 
                className="w-full h-96 rounded-lg border"
                style={{ minHeight: '400px' }}
              />
              
              <div className="flex gap-2">
                <Button onClick={openInMaps} variant="outline" className="flex-1">
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </>
          )}
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">{hospitalName}</h4>
            <p className="text-sm text-gray-600">{hospitalAddress}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;