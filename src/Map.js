import React, { useRef, useEffect, useState, lazy } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import ReactDOM from "react-dom";
import "./Map.css";
import { gql, useQuery } from "@apollo/client";
import {
  Radio,
  RadioGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  extendTheme,
} from "@chakra-ui/react";
import { radioTheme } from "./components/radiobuttonstyle.js";

export const theme = extendTheme({
  components: { Radio: radioTheme },
});

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Popup = ({ cityName, countryName, data, handlePopupClose, rank }) => (
  <div
    className="popup"
    style={{
      position: "absolute",
      right: `80px`,
      top: `200px`,
    }}
  >
    <button className="close-button" onClick={handlePopupClose}>
      X
    </button>
    <h2 className="city-popup-title">
      {cityName}, {countryName}
    </h2>
    <h3 className="cityRank">Overall cost ranking: {rank}</h3>
    <table>
      <thead>
        <tr>
          <th className="descriptionTitle">Description</th>
          <th className="priceTitle">Price</th>
          <th className="rankingTitle">Ranking</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="itemDescription">{item.description}</td>
            <td className="itemPrice">
              {item.currency}
              {item.value}
            </td>
            <td className="itemRank">{item.rank}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function Sidebar({
  cityData,
  layer,
  handleCitySelect,
  selectedCity,
  selectedCountry,
  handleCountrySelect,
  query,
  setQuery,
}) {
  const cityDataEntries = cityData;
  const cityNames = cityDataEntries.map((city) => city.name);
  const countryNames = cityDataEntries.map((city) => city.country);
  const uniqueCountryNames = new Set();
  countryNames.forEach((country) => uniqueCountryNames.add(country.trim()));
  const uniqueCountryNamesArray = Array.from(uniqueCountryNames);

  const filteredCityNames = cityNames.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCountryNames = uniqueCountryNamesArray.filter((country) =>
    country.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  if (layer === "city-areas") {
    return (
      <div id="sidebar">
        <div className="sidebar-title">
          <input
            type="text"
            placeholder="Search cities"
            className="searchbar"
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <div className="sidebar-content">
          <RadioGroup
            defaultValue="1"
            onChange={handleCitySelect}
            value={selectedCity}
          >
            {filteredCityNames.map((city) => (
              <div id="city-select">
                <Radio value={city} className="city-radio">
                  <span className="city-button">{city}</span>
                </Radio>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  } else {
    return (
      <div id="sidebar">
        <div className="sidebar-title">
          <input
            type="text"
            placeholder="Search countries"
            className="searchbar"
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <div className="sidebar-content">
          <RadioGroup
            defaultValue="1"
            onChange={handleCountrySelect}
            value={selectedCountry}
          >
            {filteredCountryNames.map((country) => (
              <div id="country-select">
                <Radio value={country}>{country}</Radio>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  }
}

//Start of Map component

const Map = ({ sources = [], cityData = [], layer, showDrawerProp }) => {
  const [loaded, setLoaded] = useState(false);
  const cityDataEntries = cityData;
  const mapContainerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [visibleLayer, setVisibleLayer] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDrawer, setShowDrawer] = useState(showDrawerProp);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState("");

  const handlePopupClose = () => {
    setPopup(null);
    setSelectedCity(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  // Initialize map when component mounts
  useEffect(() => {
    console.log("mapparams");
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/hugomoran/clfq3nsns008y01pcwqpu121m",
      projection: "globe",
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
              "#756A6A",
              "#5E7564",
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
        map.easeTo({
          center: coordinates,
          speed: 0.5,
          zoom: 7,
        });

        setPopup(
          <Popup
            cityName={feature?.properties?.city}
            countryName={feature?.properties?.country}
            data={
              cityDataEntries.find(
                (city) => city.name === feature?.properties?.cityNumbeo
              ).data
            }
            handlePopupClose={handlePopupClose}
            rank={
              cityDataEntries.find(
                (city) => city.name === feature?.properties?.cityNumbeo
              ).ranking
            }
          />
        );
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
      if (visibleLayer === null) {
        setVisibleLayer(layer);
      } else {
        map.setLayoutProperty(visibleLayer, "visibility", "none");
        setVisibleLayer(layer);
      }
    }
  }, [map, loaded, layer]);

  useEffect(() => {
    if (map && loaded) {
      if (selectedCity != null) {
        const lat = cityData.find(
          (city) => city.name === selectedCity
        ).latitude;
        const lon = cityData.find(
          (city) => city.name === selectedCity
        ).longitude;
        const country = cityData.find(
          (city) => city.name === selectedCity
        ).country;
        const data = cityDataEntries.find(
          (city) => city.name === selectedCity
        ).data;
        const rank = cityData.find(
          (city) => city.name === selectedCity
        ).ranking;

        console.log(lat);
        const lonlat = [lon, lat];
        map.easeTo({
          center: lonlat,
          speed: 0.5,
          zoom: 7,
        });

        setPopup(
          <Popup
            cityName={selectedCity}
            countryName={country}
            data={data}
            handlePopupClose={handlePopupClose}
            rank={rank}
          />
        );
      }
    }
  }, [map, loaded, selectedCity]);

  useEffect(() => {
    if (showDrawerProp) {
      setShowDrawer(true);
    } else {
      setShowDrawer(false);
    }
  }, [showDrawerProp]);

  return (
    <div>
      <div className={`sidebar ${showDrawer ? "sidebar-open" : ""}`}>
        <Sidebar
          cityData={cityData}
          layer={layer}
          handleCitySelect={handleCitySelect}
          selectedCity={selectedCity}
          selectedCountry={selectedCountry}
          handleCountrySelect={handleCountrySelect}
          query={query}
          setQuery={setQuery}
        />
      </div>
      {popup}
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
