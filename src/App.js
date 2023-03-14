import React from 'react';
import Map from './Map';
import citydata from "./citydata.geojson";
import countriesdata from "./countries-mod.geojson";

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

const App = () =>  {




  return (
    <div>
<Map/>
    </div>
  );
}

export default App;
