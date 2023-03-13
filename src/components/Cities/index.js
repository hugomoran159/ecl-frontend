import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import Map from "../Map";








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