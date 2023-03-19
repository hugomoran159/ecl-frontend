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

/*
const mapDefaults = {
  basemap: "mapbox://styles/mapbox/light-v11",
  center: [5, 34],
  zoom: 4,
  projection: "mercator"
}


const Sources = [
  {
  id: "countrydata",
  type: "geojson",
  data: countriesdata,
  },
  {
  id: "citydata",
  type: "geojson",
  data: citydata,
  }
]


const Layers = [ 
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
        "#E72918",
      ],
      "fill-opacity": 0.7,
    },
  },
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
          [3, "#5231ff"],
        ],
      },
      "fill-opacity": 0.5,
    }, 
  },
  
];
*/
const GET_CITY_DATA = gql`
  query {
    cities {
      name
      data {
        name
        description
        currency
        value
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
    const cityData = city.data.map((data) => ({
      name: data.name,
      description: data.description,
      currency: data.currency,
      value: data.value,
    }));

    return {
      name: city.name,
      data: cityData,
    };
  });
  console.log("data retrieved");

  return cities;
}

const App = () => {
  const sources = [SetCountryGeojson()[0], SetCityGeojson()[0]];
  const cityData = SetCityData();
  return (
    <div>
      <Navbar sources ={sources} cityData = {cityData}>
        
      </Navbar>
    </div>
  );
};

export default App;
