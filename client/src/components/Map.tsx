import React, { useRef, useEffect, useState } from "react";
import Leaflet, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapMarker } from "./MapMarker";
import { MapCircle } from "./MapCircle";

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
  range: number;
  markers: [];
  fetchData: any;
  setCoords: any;
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
  range,
  setCoords,
}) => {
  const mapRef = useRef<Leaflet.Map | null>(null);
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

      // Setup events
      mapRef.current.on("click", (e: LeafletMouseEvent) => {
        if (mapRef.current) {
          mapRef.current.panTo([e.latlng.lat, e.latlng.lng]);

          // Update coords
          setCoords(e.latlng.lat, e.latlng.lng);
        }
      });

      // Map is ready
      setMapStatus(EMapStatus.Loaded);
    }
  }, [mapStatus, initLatitude, initLongitude, range]);

  // Move map and fetch data
  // when the latitude and longitude change
  // i.e. when user wants to find their location
  useEffect(() => {
    if (
      mapStatus === EMapStatus.Loaded &&
      mapRef.current &&
      latitude &&
      longitude &&
      range
    ) {
      mapRef.current.panTo([latitude, longitude]);

      // Tell parent to fetch data
      fetchData(latitude, longitude, range); // Don't include in deps unless we want a loop
    }
  }, [mapStatus, latitude, longitude, range]);

  return (
    <div className="map">
      <div id="mapid" className="map__wrapper">
        {mapStatus === EMapStatus.Loaded && mapRef.current && markers && (
          <>
            <MapCircle
              latitude={latitude || initLatitude}
              longitude={longitude || initLongitude}
              range={range}
              mapRef={mapRef.current}
            />
            {renderMarkers([...markers], mapRef.current)}{" "}
          </>
        )}
      </div>
    </div>
  );
};
