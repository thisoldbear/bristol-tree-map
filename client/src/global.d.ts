interface Tree {
  id: string;
  latitude: number;
  longitude: number;
  common?: string;
  girth?: string;
  latin?: string;
  state?: string;
}

interface KeyedTree {
  [id: string]: Tree;
}

interface IMapMarkerProps extends Tree {
  map: Leaflet.Map;
}
