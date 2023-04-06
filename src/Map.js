import React, { useRef, useEffect, useState, lazy } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./Map.css";
import { Radio, RadioGroup } from "@chakra-ui/react";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

const Popup = ({
  cityName,
  countryName,
  data,
  handlePopupClose,
  rank,
  group,
  resetPreviusCity,
  previousSelected,
  previousSelectedGroup,
  testprop,
}) => (
  <div
    className="popup"
    style={{
      position: "absolute",
      right: `60px`,
      top: `200px`,
    }}
  >
    <button className="close-button" onClick={handlePopupClose}>
      X
    </button>
    <h1 className="city-popup-title">
      {cityName}, {countryName}
    </h1>
    <h2 className="cityRank">Overall cost ranking: {rank}</h2>
    {previousSelected &&
    previousSelectedGroup &&
    cityName !== previousSelected ? (
      <div>
        <h4
          className={`grantGroup ${
            countryName === " United Kingdom" ? "grantGroup-England" : ""
          }`}
        >
          Estimated Erasmus grant from {previousSelected} to {cityName}
          {countryName === " United Kingdom" && <span>*</span>}:
          {group === previousSelectedGroup && <span> €260 to €540 </span>}
          {group > previousSelectedGroup && <span> €200 to €490 </span>}
          {group < previousSelectedGroup && <span> €310 to €600 </span>}
          per month
        </h4>
        <div>
          <button onClick={resetPreviusCity} className="resetButton">
            Reset home city
          </button>
          {countryName === " United Kingdom" && <span>*See about section</span>}
        </div>
      </div>
    ) : (
      <h4 className="grantGroup">
        Select another city to view estimated Erasmus grant {testprop}
      </h4>
    )}
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
            <td className="itemPrice">{formatter.format(item.value)}</td>
            <td className="itemRank">{item.rank}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function getColorByRanking(ranking, maxRanking) {
  const hue =
    (1 - (ranking - 1) / (maxRanking - 1)) * 25 +
    ((ranking - 1) / (maxRanking - 1)) * 160;
  return `hsl(${hue}, 100%, 50%)`;
}

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
  const filteredCityDataEntries = cityDataEntries
    .filter((city) =>
      city.propername.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => a.ranking - b.ranking);

  const countryNames = cityDataEntries.map((city) => city.country);
  const uniqueCountryNames = new Set();
  countryNames.forEach((country) => uniqueCountryNames.add(country.trim()));
  const uniqueCountryNamesArray = Array.from(uniqueCountryNames);

  const filteredCityNames = filteredCityDataEntries.filter((city) =>
    city.propername.toLowerCase().includes(query.toLowerCase())
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
              <div
                className={`city-select rank-${city.ranking}`}
                style={{
                  backgroundColor: getColorByRanking(
                    city.ranking,
                    filteredCityNames.length
                  ),
                  borderRadius: "2px",
                }}
              >
                <Radio value={city.propername} variants="radiobutton">
                  {city.propername}
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

function Sidebar2({
  cityName,
  cityData,
  resetPreviusCity,
  previousSelected,
  previousSelectedGroup,
  handlePopupClose,
}) {

  if (!cityName) {
    return (
      <div id="sidebar2">
        <p className="cityRank">Select A City To Get Started</p>
      </div>
    );
  }
  const data = cityData.find((city) => city.propername === cityName).data;
  const group = cityData.find((city) => city.propername === cityName).group;
  const rank = cityData.find((city) => city.propername === cityName).ranking;
  const countryName = cityData.find(
    (city) => city.propername === cityName
  ).country;

  
  return (
    <div id="sidebar2">
      <h1 className="city-popup-title">
        {cityName}, {countryName}
      </h1>
      <h2 className="cityRank">Overall cost ranking: {rank}</h2>
      {previousSelected &&
      previousSelectedGroup &&
      cityName !== previousSelected ? (
        <div>
          <h4
            className={`grantGroup ${
              countryName === " United Kingdom" ? "grantGroup-England" : ""
            }`}
          >
            Estimated Erasmus grant from {previousSelected} to {cityName}
            {countryName === " United Kingdom" && <span>*</span>}:
            {group === previousSelectedGroup && <span> €260 to €540 </span>}
            {group > previousSelectedGroup && <span> €200 to €490 </span>}
            {group < previousSelectedGroup && <span> €310 to €600 </span>}
            per month
          </h4>
          <div>
            <button onClick={resetPreviusCity} className="resetButton">
              Reset home city
            </button>
            {countryName === " United Kingdom" && (
              <span>*See about section</span>
            )}
          </div>
        </div>
      ) : (
        <h4 className="grantGroup">
          Select another city to view estimated Erasmus grant
        </h4>
      )}
      <table id="table-container">
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
              <td className="itemDescription">{item.name === "rent" ? 'One Room in an Apartment (3 bedrooms)' : item.description}</td>
              <td className="itemPrice">{item.name === "rent" ? formatter.format(item.value/3) : formatter.format(item.value)}</td>
              <td className="itemRank">{item.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
  const [previousSelected, setPreviousSelected] = useState(null);
  const [citySelected, setCitySelected] = useState(false);

  const resetPreviusCity = () => {
    setPreviousSelected(selectedCity);
  };

  const handlePopupClose = () => {
    setCitySelected(false);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySelected(true);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  // Initialize map when component mounts
  useEffect(() => {
    console.log("mapparams");
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/hugomoran/clg3xhd9d001j01jz4bwcvunw",
      projection: "mercator",
      center: [12.5788, 48.888],
      zoom: 2,
      maxBounds: [
        [-32.79, 23.49],
        [58.4, 71.51],
      ],
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
              "#E85950",
              "#8E8D89",
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
        handleCitySelect(features[0].properties.city);
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
          (city) => city.propername === selectedCity
        ).latitude;
        const lon = cityData.find(
          (city) => city.propername === selectedCity
        ).longitude;
        const country = cityData.find(
          (city) => city.propername === selectedCity
        ).country;
        const data = cityDataEntries.find(
          (city) => city.propername === selectedCity
        ).data;
        const rank = cityData.find(
          (city) => city.propername === selectedCity
        ).ranking;
        const group = cityData.find(
          (city) => city.propername === selectedCity
        ).group;

        console.log(lat);
        const lonlat = [lon, lat];
        map.easeTo({
          center: lonlat,
          speed: 0.5,
          zoom: 8,
        });

        if (previousSelected == null) {
          setPopup(
            <Popup
              cityName={selectedCity}
              countryName={country}
              data={data}
              handlePopupClose={handlePopupClose}
              rank={rank}
              group={group}
            />
          );
          setPreviousSelected(selectedCity);
        } else {
          setPopup(
            <Popup
              cityName={selectedCity}
              countryName={country}
              data={data}
              handlePopupClose={handlePopupClose}
              rank={rank}
              group={group}
              resetPreviusCity={resetPreviusCity}
              previousSelected={previousSelected}
              previousSelectedGroup={
                cityDataEntries.find(
                  (city) => city.propername === previousSelected
                ).group
              }
            />
          );
        }
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
      {citySelected ? (
        previousSelected !== null ? (
          <Sidebar2
            cityName={selectedCity}
            cityData={cityDataEntries}
            resetPreviusCity={resetPreviusCity}
            previousSelected={previousSelected}
            previousSelectedGroup={
              cityDataEntries.find(
                (city) => city.propername === previousSelected
              ).group
            }
          />
        ) : (
          <Sidebar2 cityName={selectedCity} cityData={cityDataEntries} />
        )
      ) : (
        <Sidebar2 />
      )}
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
