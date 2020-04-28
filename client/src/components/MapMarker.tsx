import { useRef, useEffect } from "react";
import Leaflet from "leaflet";

const icon = Leaflet.icon({
  iconUrl: "tree-icon.png",
  iconSize: [32, 32],
});

export const MapMarker: React.FC<IMapMarkerProps> = ({ id, latitude, longitude, map }) => {
  const marker = useRef<Leaflet.Marker | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      marker.current = Leaflet.marker([latitude, longitude], { icon: icon })
        .addTo(map)
        .bindPopup(`${id}`);
    }

    // Cleanup
    return () => {
      if (marker.current) {
        map.removeLayer(marker.current);
      }
    };
  }, [id, latitude, longitude, map]);

  return null;
};
