import React, { useRef, useState } from "react";
import "./navbar.css";
import { faBars, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import Map from "../Map.js";
import customFont from "../CenturyGothic.ttf";



function Navbar({ sources = [], cityData = [] }) {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [showTitlePopup, setShowTitlePopup] = React.useState(false);
  const [selectedLayer, setSelectedLayer] = React.useState("city-areas");


  // Handler for when an image is clicked

  

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
  };

  const handleMenuButtonClick = () => {
    setShowDrawer(!showDrawer);
  };

  const handleTitleClick = () => {
    setShowTitlePopup(!showTitlePopup);
  };

  return (
    <div>
      <nav className={showDrawer ? "shifted" : ""}>
        <div className="navbar-left">
          <button className="navbar-button" onClick={handleMenuButtonClick}>
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>

          <Popover isLazy className="title-popup">
            <PopoverTrigger>
              <h1 className="navbar-title" onClick={handleTitleClick}>
                Erasmus Cost Of Living
              </h1>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold">
                Info On this Website
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <p>
                  This Website is currently a work in progress.
                  </p>
                  <p>
                  This is a final year project for Trinity College Dublin.
                  </p>
                  <p>
                  All data is sourced from <a class ='numbeo-link' href='https://www.numbeo.com'>Numbeo.com</a>
                </p>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
        <div className="navbar-right">
          <Popover isLazy>
            <PopoverTrigger>
              <button className="navbar-map">
                <FontAwesomeIcon icon={faMap} size="lg" />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold">Select a Map</PopoverHeader>

              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <RadioGroup onChange={handleLayerSelect} value={selectedLayer}>
                  <Radio value="city-areas">Cities</Radio>
                  <Radio value="countries">Countries</Radio>
                </RadioGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
      <Map sources={sources} cityData={cityData} layer={selectedLayer} showDrawerProp={showDrawer} />
    </div>
  );
}

export default Navbar;


