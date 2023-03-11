import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { AttachmentIcon } from "@chakra-ui/icons";
import { ChatIcon, CalendarIcon, StarIcon } from "@chakra-ui/icons";

const ToolButtons = () => {
  return (
    <>
      <div style={{marginTop:"10px"}}>
        <AttachmentIcon sx={{ marginLeft: "20px" }} />
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
          Workspaces
        </button>
      </div>

      <div>
        <ChatIcon sx={{ marginLeft: "20px" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "#e2e2e2",
            border: "none",
            color: "#2d3b50",
            marginLeft: "5px"
          }}
        >
          Listado de contactos
        </button>
      </div>

      <div>
        <CalendarIcon sx={{ marginLeft: "20px" }} />
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
          Calendario
        </button>
      </div>

      <div>
        <StarIcon sx={{ marginLeft: "20px" }} />
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
          Mis Ingresos
        </button>
      </div>
    </>
  );
};

export default ToolButtons;
