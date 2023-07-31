import React from "react";
import styles from "../../styles/interfaces/pages/userwsp.module.css";

import Cards from "../Cards/Cards";

const UserWorkSpace = () => {
  return (
    <div className={styles.principalContainer}>
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <h2
          style={{
            fontSize: "40px",
            marginTop: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          ¿Que espacio de trabajo deseas utilizar?
        </h2>
        <p>
          Puedes escoger cualquiera de los siguientes espacios de trabajo y
          guardarlos en tu carpeta de Workspaces en Toolbar Space
        </p>
      </div>
      <Cards />
    </div>
  );
};

export default UserWorkSpace;
