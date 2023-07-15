import React, { useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { CloseIcon } from "@chakra-ui/icons";

import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";

import EndSession from "../organisms/modals/endSession";

import styles from "../../styles/ToolButtons.module.css";

const EndBar = ({ setWorkSpaceFlow }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EndSession isOpen={isOpen} setIsOpen={setIsOpen} router={router} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          marginBottom: "20px",
          color: "#252525",
          width: "100%"
        }}
      >
        <div className={styles.buttonSpace}>
          <SettingsIcon sx={{ marginLeft: "20px" }} />
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "5px",
            }}
            onClick={() => setWorkSpaceFlow("userConfig")}
          >
            Configuración de usuario
          </button>
        </div>
        <div className={styles.buttonSpace}>
          <CloseIcon sx={{ marginLeft: "20px", marginTop: "2px" }} />
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "5px",
            }}
            onClick={() => setIsOpen(true)}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default EndBar;
