import React, { useRef, useEffect, useState } from "react";
import Leaflet, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapMarker } from "./MapMarker";

import "./Map.scss";

const renderMarkers = (markers: IMapMarkerProps[], map: Leaflet.Map) =>
  markers.map(({ id, latitude, longitude }) => (
    <MapMarker
      id={id}
      key={id}
      map={map}
      latitude={latitude}
      longitude={longitude}
    />
  ));

interface MapProps {
  latitude: number;
  longitude: number;
  initLatitude: number;
  initLongitude: number;
  markers?: [];
  fetchData?: any;
}

enum EMapStatus {
  Init,
  Loaded,
}

export const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  initLatitude,
  initLongitude,
  markers,
  fetchData,
}) => {
  const mapRef = useRef<Leaflet.Map | null>(null);
  const circleRef = useRef<Leaflet.Circle | null>(null);
  const [mapStatus, setMapStatus] = useState<EMapStatus>(EMapStatus.Init);

  useEffect(() => {
    if (mapStatus === EMapStatus.Init) {
      // Create a new map
      mapRef.current = Leaflet.map("mapid").setView(
        [initLatitude, initLongitude],
        15
      );

      // Add open street mpa tiles
      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      circleRef.current = Leaflet.circle([initLatitude, initLongitude], {
        color: "#ff5722",
        fillColor: "transparent",
        radius: 500,
        opacity: 0.5,
      }).addTo(mapRef.current);

      // Setup events
      mapRef.current.on("click", (e: LeafletMouseEvent) => {
        if (mapRef.current) {
          mapRef.current.panTo([e.latlng.lat, e.latlng.lng]);

          if (circleRef.current) {
            mapRef.current.removeLayer(circleRef.current);
          }

          circleRef.current = Leaflet.circle([e.latlng.lat, e.latlng.lng], {
            color: "#ff5722",
            fillColor: "transparent",
            radius: 500,
            opacity: 0.5,
          }).addTo(mapRef.current);

          fetchData(e.latlng.lat, e.latlng.lng); // Don't include in deps unless we want a loop
        }
      });

      // Map is ready
      setMapStatus(EMapStatus.Loaded);
    }
  }, [mapStatus, initLatitude, initLongitude]);

  // Move map and fetch data
  // when the latitude and longitude change
  // i.e. when user wants to find their location
  useEffect(() => {
    if (
      mapStatus === EMapStatus.Loaded &&
      mapRef.current &&
      latitude &&
      longitude
    ) {
      mapRef.current.panTo([latitude, longitude]);

      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
      }

      circleRef.current = Leaflet.circle([latitude, longitude], {
        color: "#ff5722",
        fillColor: "transparent",
        radius: 500,
        opacity: 0.5,
      }).addTo(mapRef.current);

      fetchData(latitude, longitude); // Don't include in deps unless we want a loop
    }
  }, [mapStatus, latitude, longitude]);

  return (
    <div className="map">
      <div id="mapid" className="map__wrapper">
        {mapStatus === EMapStatus.Loaded &&
          mapRef.current &&
          markers &&
          renderMarkers([...markers], mapRef.current)}
      </div>
    </div>
  );
};
