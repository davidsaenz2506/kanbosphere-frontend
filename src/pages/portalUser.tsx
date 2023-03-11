import React from "react";
import styles from "../styles/portal.module.css";
import "bootstrap/dist/css/bootstrap.css";

import { Avatar } from "@nextui-org/react";

import initResizer from "@/utilities/resizePage";
import ToolButtons from "../components/portal/ToolButtons";
import EndBar from "../components/portal/EndBar";
import { border } from "@chakra-ui/react";

const PortalUser = () => {
  
  React.useEffect(() => {
    var resizerTool = document.getElementById("resizerTool");
    var toolSpace = document.getElementById("toolSpace");

    initResizer(resizerTool, toolSpace);
  });

  return (
    <div
      style={{ backgroundColor: "white", height: "100vh", overflow: "hidden" }}
    >
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#" style={{ marginLeft: "20px" }}>
          Portal Home
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ marginRight: "20px"}}>
            Hans David Saenz Varon
          </p>
          <Avatar style={{ marginRight: "20px" }} text="David" />
        </div>
      </nav>
      <div className={styles.principalContainer}>
        <div className={styles.toolSpace}>
          <div id="toolSpace" className={styles.toolContainer}>
            <h5
              style={{
                textAlign: "left",
                marginTop: "20px",
                marginBottom:"20px",
                fontSize: "30px",
                marginLeft: "20px",
                fontWeight: "bolder"
              }}
            >
              Toolbar Space
            </h5>
            <hr className={styles.hrElement}></hr>
            <ToolButtons />
            <EndBar />
          </div>

          <div id="resizerTool" className={styles.resizerParticle}></div>
        </div>

        <div className={styles.workSpace}>
        </div>
      </div>
    </div>
  );
};

export default PortalUser;
