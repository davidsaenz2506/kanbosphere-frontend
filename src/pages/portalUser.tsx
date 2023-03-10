import React from "react";
import styles from "../styles/portal.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { Avatar } from "@nextui-org/react";
import initResizer from "@/utilities/resizePage";

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
          <p style={{ marginRight: "20px", marginTop: "15px" }}>
            Hans David Saenz Varon
          </p>
          <Avatar style={{ marginRight: "20px" }} text="David" />
        </div>
      </nav>
      <div className={styles.principalContainer}>
        <div className={styles.toolSpace}>
          <div id="toolSpace" className={styles.toolContainer}>
            <h1 style={{ textAlign: "center" }}>Herramientas</h1>
          </div>
          <div id="resizerTool" className={styles.resizerParticle}></div>
        </div>

        <div className={styles.workSpace}>
          <h1 style={{ textAlign: "center" }}>Zona de trabajo</h1>
        </div>
      </div>
    </div>
  );
};

export default PortalUser;
