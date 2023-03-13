import React, { useRef, useEffect, useState, lazy } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import "./Map.css";
import citydata from "./citydata.json";
import countriesdata from "./countries-mod.geojson";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Popup = ({ cityName, countryName }) => (
  <div className="popup">
    <h3 className="city-popup">
      {cityName}, {countryName}
    </h3>
  </div>
);

function changeFillColor(layerId, color, map) {
  map.setPaintProperty(layerId, "fill-color", color);
}

const Map = () => {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

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
                [0, "#84222f"],
                [1, "#445ef5"],
                [2, "#5231ff"],
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
          layout: { visibility: "visible" },
          filter: ['!', ['has', 'point_count']],
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
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["city-areas"],
      });
      if (features.length > 0) {
        const feature = features[0];
        const coordinates = [
          feature.properties.GCPNT_LON,
          feature.properties.GCPNT_LAT,
        ];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            cityName={feature?.properties?.UC_NM_MN}
            countryName={feature?.properties?.XC_NM_LST}
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
/*
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
*/
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

    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default Map;
