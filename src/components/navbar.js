import React, { useRef } from "react";
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
  RadioGroup
} from "@chakra-ui/react";
import Map from "../Map.js";

function Sidebar() {
  return (
    <div>
      <div className="text-buffer"></div>
        <h1>This is a test</h1>
        <h1>This is a test</h1>
        <h1>This is a test</h1>
        <h1>This is a test</h1>
        <h1>This is a test</h1>
        <h1>This is a test</h1>
    </div>
  );
}



function Navbar({sources = [], cityData = []}) {
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

          <Popover isLazy>
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
                  Erasmus Cost of Living is a project that aims to provide a
                  comprehensive overview of the cost of living in European
                  cities. The project is based on the Erasmus+ programme, which
                  is a European Union programme that aims to promote mobility
                  and exchange of students, teachers and staff in higher
                  education. The project is based on the Erasmus+ programme,
                  which is a European Union programme that aims to promote
                  mobility and exchange of students, teachers and staff in
                  higher education.
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
                <RadioGroup
                    onChange={handleLayerSelect}
                    value={selectedLayer}
                    >
                    <Radio value="city-areas">Cities</Radio>
                    <Radio value="countries">Countries</Radio>
                </RadioGroup>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
      <div className={`sidebar ${showDrawer ? "sidebar-open" : ""}`}>
        <Sidebar />
      </div>
      <Map sources={sources} cityData={cityData} layer={selectedLayer} />
    </div>
  );
}

export default Navbar;

/*
{showDrawer && <Drawer onClose={() => setShowDrawer(false)} />}
      {showTitlePopup && <TitlePopup onClose={() => setShowTitlePopup(false)} />}
      
*/
//#424140
