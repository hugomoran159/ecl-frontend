import React from "react";
import Map from "./Map";
import citydata from "./citydata.geojson";
import countriesdata from "./countries-mod.geojson";
import { gql, useQuery } from "@apollo/client";
import { IconButton, Toolbar, AppBar, Typography, Button } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import Navbar from "./components/navbar";
import "./App.css";

const GET_CITY_DATA = gql`
  query {
    cities {
      name
      latitude
      longitude
      ranking
      group
      country {
        name
      }
      data {
        name
        description
        currency
        value
        rank
      }
    }
  }
`;

const GET_CITY_AREAS = gql`
  query {
    cityGeojson {
      geojson
    }
  }
`;

const GET_COUNTRY_AREA = gql`
  query {
    countryGeojson {
      geojson
    }
  }
`;

function SetCityGeojson() {
  const { loading, error, data } = useQuery(GET_CITY_AREAS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log("data retrieved");
  return data.cityGeojson.map(({ geojson }) => {
    return JSON.parse(geojson);
  });
}

function SetCountryGeojson() {
  const { loading, error, data } = useQuery(GET_COUNTRY_AREA);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log("data retrieved");
  return data.countryGeojson.map(({ geojson }) => {
    return JSON.parse(geojson);
  });
}

function SetCityData() {
  const { loading, error, data } = useQuery(GET_CITY_DATA);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const cities = data.cities.map((city) => {
    const country = city.country.name;
    const cityData = city.data.map((data) => ({
      name: data.name,
      description: data.description,
      currency: data.currency,
      value: data.value,
      rank: data.rank,
    }));

    return {
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: country,
      data: cityData,
      ranking: city.ranking,
    };
  });
  console.log("data retrieved");

  return cities;
}

const App = () => {
  const sources = [SetCountryGeojson()[0], SetCityGeojson()[0]];
  const cityData = SetCityData();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (sources && cityData && sources.length > 0 && cityData.length > 0) {
      setLoading(false);
    }
  }, [sources, cityData]);

  return (
    <div>
      <div
        className={`loading ${loading ? "" : "loading-finished"}`}
      >
        <p className="loading-text">Loading...</p>
      </div>
      <div
        className="content"
        style={{
          opacity:
            sources && cityData && sources.length > 0 && cityData.length > 0
              ? 1
              : 0,
        }}
      >
        {sources && cityData && sources.length > 0 && cityData.length > 0 ? (
          <Navbar sources={sources} cityData={cityData}></Navbar>
        ) : null}
      </div>
    </div>
  );
};

export default App;
