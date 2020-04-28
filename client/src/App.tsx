import React, { useEffect, useState } from "react";

import "./App.scss";

import { Map } from "./components/Map";
import { SearchForm } from "./components/SearchForm";

function App() {
  const initLatitude = 51.4532;
  const initLongitude = -2.5973;

  const [coords, setCoords] = useState<any>({
    latitude: null,
    longitude: null,
  });

  const [trees, setTrees] = useState<any>([]);
  const [range, setRange] = useState<number>(500);

  const fetchData = (latitude: number, longitude: number, range: number) => {
    setTrees([]);

    const data = fetch(`/trees?latitude=${latitude}&longitude=${longitude}&range=${range}`)
      .then((res) => res.json())
      .then((res) => setTrees(res && res.tree ? [...res.tree] : []));

    return data;
  };

  useEffect(() => {
    fetchData(initLatitude, initLongitude, range);
  }, []);

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
        <p>Or click on the map to pick a new search center.</p>
        <hr />
        <SearchForm initialValue={500} updateRange={(range: number) => {
          setRange(range);

          setCoords({
            latitude: coords.latitude || initLatitude,
            longitude: coords?.longitude || initLongitude,
          });
        }} />
      </div>
      <div className="app__map">
        <Map
          latitude={coords?.latitude}
          longitude={coords?.longitude}
          initLatitude={initLatitude}
          initLongitude={initLongitude}
          markers={trees}
          range={range}
          fetchData={fetchData}
          setCoords={(latitude: number, longitude: number) => {
            setCoords({latitude, longitude})
          }}
        />
      </div>
    </div>
  );
}

export default App;
