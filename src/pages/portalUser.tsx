import React, { useState } from "react";
import styles from "../styles/portal.module.css";
import "bootstrap/dist/css/bootstrap.css";

import { Avatar } from "@nextui-org/react";

import initResizer from "@/utilities/resizePage";
import ToolButtons from "../components/portal/ToolButtons";
import EndBar from "../components/portal/EndBar";

import WorkspaceManager from "../components/organisms/workspaces/WorkspaceManager";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import Cookies from "universal-cookie";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

import jwtDecode from "jwt-decode";
import { GetCurrentUser } from "@/services/user/getCurrentUser";
import { getFirstName } from "@/utilities/getFirstName";
import Loading from "@/components/molecules/Loading";

const PortalUser = () => {
  const [workspaceFlow, setWorkspaceFlow] = useState("");
  const [loadingServerData, setLoadingServerData] = useState(false);
  const [resizeListener, setResizeListener] = useState(0);
  const computedUserItems = useCurrentUser();
  const cookies = new Cookies();

  const userPrivateToken = cookies.get("tumbleToken");
  const workSpaces = useWorkspace();
  const isBrowser = () => typeof window !== "undefined";

  if (isBrowser()) {
    window.onresize = function onResize() {
      const workSpaceContainer = document.getElementById("workSpace");
      setResizeListener(Math.random() * 10 - 1 + 1);

      if (workSpaceContainer) {
        workSpaceContainer.style.width = "100%";
      }
    };
  }

  React.useEffect(() => {
    async function getUserInfoFromServer() {
      const decodedInfoFromServer: any = jwtDecode(userPrivateToken);

      const userInfoFromDataBase = await GetCurrentUser(
        decodedInfoFromServer.username
      );

      computedUserItems.setCurrentUser(userInfoFromDataBase);
    }

    getUserInfoFromServer();
  }, []);

  React.useEffect(() => {
    if (computedUserItems.currentUser.userID)
      workSpaces.fetchWorkSpaces(
        computedUserItems.currentUser.userID,
        setLoadingServerData
      );
  }, [computedUserItems.currentUser]);

  React.useEffect(() => {
    var resizerTool = document.getElementById("resizerTool");
    var toolSpace = document.getElementById("toolSpace");
    var workSpace = document.getElementById("workSpace");

    initResizer(resizerTool, toolSpace, workSpace);
  });

  return (
    <React.Fragment>
      {!loadingServerData && (
        <Loading message="Bienvenido! Estamos cargando tu configuración" />
      )}
      <div style={{ backgroundColor: "white", height: "100vh" }}>
        <nav
          id="navbarHome"
          className="navbar navbar-light bg-light"
          style={{
            background:
              "linear-gradient(90deg, rgba(57,72,103,1) 0%, rgba(33,42,62,1) 100%, rgba(0,212,255,1) 100%)",
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
              {computedUserItems.currentUser.fullname}
            </p>
            <Avatar
              style={{ marginRight: "20px" }}
              text={getFirstName(computedUserItems.currentUser.fullname)}
              src={computedUserItems.currentUser.profilePicture}
            />
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
                  fontWeight: 500,
                }}
              >
                Barra de herramientas
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
    </React.Fragment>
  );
};

export default PortalUser;
