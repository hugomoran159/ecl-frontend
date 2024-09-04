import React, { useState, useEffect } from "react";
import Map from "./Map";
import { IconButton, Toolbar, AppBar, Typography, Button } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import Navbar from "./components/navbar";
import Papa from "papaparse";
import "./App.css";

async function fetchGeojsonData(filePath) {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching geojson data:", error);
    return null;
  }
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

async function fetchCityDataFromCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse('/city_data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("Errors occurred while parsing the CSV:", results.errors);
          reject(results.errors);
        } else {
          const cities = results.data.map((city) => {
            const parseField = (field) => {
              const match = field.match(/\['(.+?)'\s*,\s*(\d+\.\d+|\d+)\s*,\s*(\d+)\]/);
              return match ? { description: match[1].trim(), value: parseFloat(match[2]), rank: parseInt(match[3], 10) } : { description: '', value: 0, rank: 0 };
            };

            return {
              name: city.city,
              currency: city.currency,
              latitude: parseFloat(city.latitude),
              longitude: parseFloat(city.longitude),
              country: city.country,
              group: parseInt(city.group, 10),
              propername: city.cityproper,
              ranking: parseInt(city.overall_rank, 10),
              data: [
                { name: "meal", ...parseField(city.meal) },
                { name: "mcmeal", ...parseField(city.mcmeal) },
                { name: "beer restaurant", ...parseField(city["beer restaurant"]) },
                { name: "milk", ...parseField(city.milk) },
                { name: "rice", ...parseField(city.rice) },
                { name: "potato", ...parseField(city.potato) },
                { name: "water", ...parseField(city.water) },
                { name: "cigarettes", ...parseField(city.cigarettes) },
                { name: "coffee", ...parseField(city.coffee) },
                { name: "ticket", ...parseField(city.ticket) },
                { name: "rent", ...parseField(city.rent) },
              ],
            };
          });
          resolve(cities);
        }
      },
      error: (error) => {
        console.error("Error fetching CSV data:", error);
        reject(error);
      },
    });
  });
}

const App = () => {
  const [sources, setSources] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const cityGeojson = await fetchGeojsonData("/citydata.geojson");
        const countryGeojson = await fetchGeojsonData("/countries-mod.geojson");
        const cities = await fetchCityDataFromCSV();
        setSources([countryGeojson, cityGeojson]);
        setCityData(cities);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="background">
{/*     <div className={`loading ${loading ? "" : "loading-finished"}`}>
        <p className="loading-text">Loading...</p>
      </div>
      */}
      <div
        className="content"
        style={{
          opacity: sources.length > 0 && cityData.length > 0 ? 1 : 0,
        }}
      >
        {sources.length > 0 && cityData.length > 0 ? (
          <Navbar sources={sources} cityData={cityData}></Navbar>
        ) : null}
      </div>
    </div>
  );
};

export default App;
