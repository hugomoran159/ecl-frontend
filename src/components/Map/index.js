import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import "./Map.css";
import PropTypes from "prop-types";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Popup = ({ cityName, countryName }) => (
  <div className="popup">
    <h3 className="city-popup">
      {cityName}, {countryName}
    </h3>
  </div>
);


const Map = ({
    center = [0, 0],
    sources = [],
    layers = [],
    zoom = 12,
    basemap = "mapbox://styles/mapbox/light-v11",
    projection = "mercator"
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  // Initialize map when component mounts
  useEffect(() => {



    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: basemap,
      center,
      zoom,
      projection,
    });

    map.on("load", () => {
        setMap(map);
    });


    return () => map.remove();
    }, []);


    useEffect(() => {
        map?.setCenter(center);
    }, [map, center]);

    useEffect(() => {
        map?.setZoom(zoom);
    }, [map, zoom]);



    /**
   * Dedicated logic for adding sources and layers as well as updating layer filters
   * We first check to make sure that the map style is loaded and
   * that sources and layers were provided
   * Next, we loop through the provided sources and check if they need to be added
   * to the map. If so, add em, else do nothing
   * Finally, we loop through the provided layers and check if they
   * have already been added to the map
   * If they have, then we apply our filters to the layer
   * Else, just add em to the map
   * This logic runs whenever the map, sources, or layers state/props
   * are updated
   */
  useEffect(() => {
    const mapReady = map?.isStyleLoaded();
    const dataReady = sources?.length > 0 && layers.length > 0;

    if (mapReady && dataReady) {
      sources.forEach((source) => {
        if (map.getSource(source.id)) return;
        const cleanSource = { ...source };
        if (source.type === "geojson") {
          delete cleanSource.id; // weird hack necessary when working with the geojson source type
        }
        map.addSource(source.id, cleanSource);
      });
      layers.forEach((layer) => {
	      if (map.getLayer(layer.id)) return
	      map.addLayer(layer, "waterway-label");
      });
    }
  }, [map, sources, layers]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
  );
};

Map.propTypes = {
    basemap: PropTypes.string,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    sources: PropTypes.arrayOf(PropTypes.object),
    layers: PropTypes.arrayOf(PropTypes.object),
    projection: PropTypes.string,
    
  };

  export default Map;





/*



  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};


*/