import React, { useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { CloseIcon } from "@chakra-ui/icons";

import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";

import EndSession from "../organisms/modals/endSession"

const EndBar = () => {
    
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <EndSession isOpen={isOpen} setIsOpen={setIsOpen} router={router}/>
    <div style={{ position: "absolute", bottom: 0, marginBottom: "20px" }}>
      <SettingsIcon sx={{ marginLeft: "20px" }} />
      <button
        type="button"
        className="btn btn-secondary btn-lg btn-block"
        style={{
          backgroundColor: "#e2e2e2",
          border: "none",
          color: "#2d3b50",
          marginLeft: "5px",
        }}
      >
        Configuración de usuario
      </button>
      <br />
      <CloseIcon sx={{ marginLeft: "20px", marginTop: "2px" }} />
      <button
        type="button"
        className="btn btn-secondary btn-lg btn-block"
        style={{
          backgroundColor: "#e2e2e2",
          border: "none",
          color: "#2d3b50",
          marginLeft: "5px",
        }}
        onClick={() => setIsOpen(true)}
      >
        Cerrar sesión
      </button>
    </div>
    </>
   
  );
};

export default EndBar;
