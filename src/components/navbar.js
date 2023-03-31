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



const About = () => {
    <div className="about-popup">


    </div>

}

function Navbar({ sources = [], cityData = [] }) {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [showAboutPopup, setShowAboutPopup] = React.useState(false);
  const [selectedLayer, setSelectedLayer] = React.useState("city-areas");

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
  };

  const handleMenuButtonClick = () => {
    setShowDrawer(!showDrawer);
  };


  const handleAboutPopup = () => {
    setShowAboutPopup(!showAboutPopup);
  };

  return (
    <div>
      <nav className={showDrawer ? "shifted" : ""}>
        <div className="navbar-left">
          <button className="navbar-button" onClick={handleMenuButtonClick}>
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
          <h1 className="navbar-title">Erasmus Cost Of Living</h1>
        </div>
        <div className="navbar-right">
          <button className="about-button" onClick={handleAboutPopup}>About</button>
        </div>
      </nav>
      <Map
        sources={sources}
        cityData={cityData}
        layer={selectedLayer}
        showDrawerProp={showDrawer}
      />
    </div>
  );
}

export default Navbar;
