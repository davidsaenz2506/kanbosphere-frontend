import React, { useState } from "react";
import styles from "../styles/portal.module.css";
import "bootstrap/dist/css/bootstrap.css";

import { Avatar } from "@nextui-org/react";

import initResizer from "@/utilities/resizePage";
import ToolButtons from "../components/portal/ToolButtons";
import EndBar from "../components/portal/EndBar";

import WorkspaceManager from "../components/organisms/workspaces/WorkspaceManager";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

const PortalUser = () => {
  const [workspaceFlow, setWorkspaceFlow] = useState("");
  const workSpaces = useWorkspace();

  console.log(workSpaces.userWsps);

  React.useEffect(() => {
    var resizerTool = document.getElementById("resizerTool");
    var toolSpace = document.getElementById("toolSpace");
    var workSpace = document.getElementById("workSpace");

    if (workSpace) {
      workSpace.style.maxWidth = `${
        document.body.getBoundingClientRect().width - 350
      }px`;
    }

    initResizer(resizerTool, toolSpace, workSpace);
  });

  return (
    <div style={{ backgroundColor: "white", height: "100vh" }}>
      <nav
        id="navbarHome"
        className="navbar navbar-light bg-light"
        style={{
          background:
            "linear-gradient(90deg, rgba(45,173,255,1) 0%, rgba(36,94,249,1) 100%)",
        }}
      >
        <a
          className="navbar-brand"
          href="#"
          style={{ marginLeft: "20px", color: "white", fontWeight: "bolder" }}
        >
          Portal Home
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ marginRight: "20px", color: "white" }}>
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
                marginBottom: "20px",
                fontSize: "30px",
                marginLeft: "20px",
                fontWeight: "bolder",
              }}
            >
              Toolbar Space
            </h5>
            <hr className={styles.hrElement}></hr>
            <ToolButtons
              workspaceFlow={workspaceFlow}
              setWorkSpaceFlow={setWorkspaceFlow}
            />
            <EndBar setWorkSpaceFlow={setWorkspaceFlow} />
          </div>

          <div id="resizerTool" className={styles.resizerParticle}></div>
        </div>

        <div id="workSpace" className={styles.workSpace}>
          <WorkspaceManager workspaceFlow={workspaceFlow} />
        </div>
      </div>
    </div>
  );
};

export default PortalUser;
