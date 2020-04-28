import React, { useEffect, useState } from "react";

import "./App.scss";

import { Map } from "./components/Map";

function App() {
  const initLatitude = 51.4532;
  const initLongitude = -2.5973;

  const [coords, setCoords] = useState<any>({
    latitude: null,
    longitude: null,
  });

  const [trees, setTrees] = useState<any>([]);

  const fetchData = (latitude: number, longitude: number) => {
    setTrees([]);

    const data = fetch(`/trees?latitude=${latitude}&longitude=${longitude}`)
      .then((res) => res.json())
      .then((res) => setTrees(res && res.tree ? [...res.tree] : []));

    return data;
  };

  useEffect(() => {
    fetchData(initLatitude, initLongitude);
  }, [initLatitude, initLongitude]);

  return (
    <div className="app">
      <div className="app__sidebar">
        <h1>Bristol Trees</h1>
        <button
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              setCoords({ latitude: null, longitude: null });
              if (position?.coords) {
                setCoords(position.coords);
              }
            });
          }}
        >
          Use my location
        </button>
      </div>
      <div className="app__map">
        <Map
          latitude={coords?.latitude}
          longitude={coords?.longitude}
          initLatitude={initLatitude}
          initLongitude={initLongitude}
          markers={trees}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
}

export default App;
