import React, { useRef, useState } from "react";
import "./navbar.css";
import { faBars, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "../Map.js";



function Navbar({ sources = [], cityData = [] }) {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [showAboutPopup, setShowAboutPopup] = React.useState(false);
  const [selectedLayer, setSelectedLayer] = React.useState("city-areas");
  const [showModal, setShowModal] = React.useState(false);

  const handleOpenModal = () => {setShowModal(true)};

  const handleCloseModal = () => {setShowModal(false)};

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
  };

  const handleMenuButtonClick = () => {
    setShowDrawer(!showDrawer);
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
          <button className="about-button" onClick={handleOpenModal}>About</button>
        </div>
      </nav>
      {showModal && (
      <div className="overlay">
        <div className="modal">
          <h1 id="about-title">About</h1>
          <p id="website-overview">Eramsus Cost of Living was made to help erasmus students plan their academic exchange.</p>
          <p id="brexit-warning">* The UK is not part of the Erasmus program, consequently grant estimates are not accurate. 
          Grants will depend on individual agreements between your home and destination institutions.</p>
          <p id="data-source">All data was sourced from <a href="https://www.numbeo.com/cost-of-living/" id="numbeo-link">Numbeo.com</a> for academic purposes</p>
          <p id="website-creator">This website was created by Hugo Moran as a final year project for Trinity College Dublin.</p>
          <p id="website-creator-email">Email: moranhu@tcd.ie</p>
          <button onClick={handleCloseModal} id="close-button">X</button>
        </div>
      </div>
      )}
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
