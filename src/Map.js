import React, { useRef, useEffect, useState, lazy } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import "./Map.css";
import citydata from "./citydata.geojson";
import countriesdata from "./countries-mod.geojson";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Popup = ({ cityName, countryName }) => (
  <div className="popup">
    <h3 className="city-popup">
      {cityName}, {countryName}
    </h3>
  </div>
);





const Map = () => {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const [visibleLayer, setVisibleLayer] = useState("city-areas");
  
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [5, 34],
      zoom: 6,
    });

    map.on("load", () => {
      
      map.addSource("countrydata", {
        type: "geojson",
        data: countriesdata,
      });

      map.addSource("citydata", {
        type: "geojson",
        data: citydata,
        generateId: true,
      });


      map.addLayer(
        {
          id: "countries",
          type: "fill",
          source: "countrydata",
          layout: { visibility: "none" },
          paint: {
            "fill-color": {
              property: "Group", // this will be your density property form you geojson
              stops: [
                [1, "#84222f"],
                [2, "#445ef5"],
                [3, "#f231ff"],
              ],
            },
            "fill-opacity": 0.5,
          },
        },
        "waterway-label"
      );
      


      map.addLayer(
        {
          id: "city-areas",
          type: "fill",
          source: "citydata",
          layout: { visibility: "none" },
          filter: ["!", ["has", "point_count"]],
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#63C0AC",
              "#f3C0AC",
            ],

            "fill-opacity": 0.7,
          },
        },
        "waterway-label"
      );
  
        
      map.setLayoutProperty(visibleLayer, "visibility", "visible");
      
    });

    

    

    

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["city-areas"],
      });
      if (features.length > 0) {
        const feature = features[0];
        const coordinates = [feature.properties.LON, feature.properties.LAT];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            cityName={feature?.properties?.city}
            countryName={feature?.properties?.country}
          />,
          popupNode
        );
        popUpRef.current
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          .addTo(map);

        map.easeTo({
          center: coordinates,
          zoom: 9,
          speed: 0.5,
        });
      }
    });

    let cityID = null;

    map.on("mousemove", "city-areas", (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (e.features.length == 0) return;

      if (cityID) {
        map.removeFeatureState({
          source: "citydata",
          id: cityID,
        });
      }

      cityID = e.features[0].id;

      map.setFeatureState(
        {
          source: "citydata",
          id: cityID,
        },
        {
          hover: true,
        }
      );
    });

    map.on("mouseleave", "city-areas", () => {
      map.getCanvas().style.cursor = "";
      if (cityID) {
        map.setFeatureState(
          {
            source: "citydata",
            id: cityID,
          },
          {
            hover: false,
          }
        );
      }
      cityID = null;
    });

    

    setMap(map);

    

    return () => map.remove();
  }, []);

  useEffect (() => { 
    if (map && map.getLayoutProperty('city-areas', "visibility", "none") && map.getLayoutProperty('countries', "visibility", "none")) {
      map.setLayoutProperty('city-areas', "visibility", "visible");
      setVisibleLayer('city-areas');
    }});
      


  const handleChange = (_event, newLayer) => {
    map.setLayoutProperty(visibleLayer, "visibility", "none");
    map.setLayoutProperty(newLayer, "visibility", "visible");

    
    return setVisibleLayer[newLayer];
  }


  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
        <ToggleButtonGroup
          color="primary"
          value={visibleLayer}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="city-areas">Cities</ToggleButton>
          <ToggleButton value="countries">Countries</ToggleButton>
        </ToggleButtonGroup>
    </div>
  );
};

export default Map;
