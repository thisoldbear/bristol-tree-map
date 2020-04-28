import React, { useRef, useEffect } from "react";
import Leaflet from "leaflet";

interface MapCircleProps {
  latitude: number;
  longitude: number;
  range: number;
  mapRef: Leaflet.Map;
}

export const MapCircle: React.FC<MapCircleProps> = ({
  latitude,
  longitude,
  range,
  mapRef,
}) => {
  const circleRef = useRef<Leaflet.Circle | null>(null);

  useEffect(() => {
    if (mapRef && latitude && longitude) {
      circleRef.current = Leaflet.circle([latitude, longitude], {
        color: "red",
        fillColor: "transparent",
        radius: range,
        opacity: 0.5,
      }).addTo(mapRef);
    }

    return () => {
      if (mapRef && circleRef.current) {
        mapRef.removeLayer(circleRef.current);
      }
    };
  }, [latitude, longitude, range]);

  return null;
};
