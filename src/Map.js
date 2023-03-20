import React, { useRef, useEffect, useState, lazy } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import "./Map.css";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Popup = ({ cityName, countryName, data }) => (
  <div className="popup">
    <h3 className="city-popup">
      {cityName}, {countryName}
    </h3>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 250 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">
                {item.currency}
                {item.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

const Map = ({ sources = [], cityData = [], layer, selectedCityProp }) => {
  const [loaded, setLoaded] = useState(false);
  const cityDataEntries = cityData;
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const [visibleLayer, setVisibleLayer] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);


  // Initialize map when component mounts
  useEffect(() => {
    console.log("mapparams");
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [12.5788, 48.888],
      zoom: 4,
    });



    console.log("mapparams");

    map.on("load", () => {
      map.addSource("countrydata", {
        type: "geojson",
        data: sources[0],
      });

      map.addSource("citydata", {
        type: "geojson",
        data: sources[1],
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
              "#63f0AC",
              "#63C0AC",
            ],

            "fill-opacity": 0.7,
          },
        },
        "waterway-label"
      );
      setMap(map);
      setLoaded(true);
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
            data={
              cityDataEntries.find(
                (city) => city.name === feature?.properties?.cityNumbeo
              ).data
            }
          />,
          popupNode
        );
        popUpRef.current
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          .addTo(map);

        map.easeTo({
          center: coordinates,
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

    console.log("mapset");

    
    return () => map.remove();
  }, [sources, cityData]);

  useEffect(() => {
    if (map && loaded) {
        map.setLayoutProperty(layer, "visibility", "visible");
        if(visibleLayer === null){
            setVisibleLayer(layer);
        }else{
            map.setLayoutProperty(visibleLayer, "visibility", "none");
            setVisibleLayer(layer);
        }
    }
  }, [map, loaded, layer]);

  

  useEffect(() => {
    if (map && loaded) {
      if(selectedCity === null){
      map.on("render", () => {
        map.queryRenderedFeatures({ layers: ["city-areas"] }).forEach((feature) => {
          if (feature.properties.city === selectedCity) {
            const coordinates = [feature.properties.LON, feature.properties.LAT];
            // create popup node
            const popupNode = document.createElement("div");
            ReactDOM.render(
              <Popup
                cityName={feature?.properties?.city}
                countryName={feature?.properties?.country}
                data={
                  cityDataEntries.find(
                    (city) => city.name === feature?.properties?.cityNumbeo
                  ).data
                }
              />,
              popupNode
            );
            popUpRef.current
              .setLngLat(coordinates)
              .setDOMContent(popupNode)
              .addTo(map);

            map.easeTo({
              center: coordinates,
              speed: 0.5,
            });
          }
        });
      });
      setSelectedCity(selectedCityProp);
    }
    }
  }, [map, loaded, selectedCityProp]);



  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default Map;

/*
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
        */
