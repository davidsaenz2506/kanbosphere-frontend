import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import React, { useState } from "react";

import styles from "./main.module.css";

import { Avatar } from "@chakra-ui/react";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import WeatherComponent from "./WeatherComponent";

export const MainLoad = () => {
  const { currentUser }: ICurrentUserContext = useCurrentUser();
  const wspUser = useWorkspace();

  return (
    <React.Fragment>
      <div className={styles.mainContainer}>
        <div className={styles.userNewsSection}>
        
          <div className={styles.userInfo}>
            <h1 style={{ color: "whitesmoke" }}>
              Bienvenido de nuevo {currentUser.fullname}
            </h1>
            <p style={{ color: "whitesmoke", fontWeight: "bold" }}>
              ¡El equipo Tumble espera que estés teniendo un maravilloso día!
            </p>
          </div>
          <div className={styles.userProps}>
          <WeatherComponent />
            <div className={styles.currentUserSection}>
              <div className={styles.userCard}>
                <div className={styles.currentUser}>
                  <h3 style={{ fontWeight: "bold" }}>Tarjeta de usuario</h3>

                  <p style={{ fontSize: "30px" }}>{currentUser.fullname}</p>

                  <p>{currentUser.email}</p>
                  <p>{currentUser.userID} </p>
                  <p style={{ marginTop: "20px" }}>
                    Total de workspaces: {wspUser.userWsps.length}{" "}
                  </p>
                </div>
                <div className={styles.userImage}>
                  <Avatar
                    className={styles.userImage}
                    height={200}
                    width={200}
                    src={currentUser.profilePicture}
                  />

                  <p
                    style={{
                      fontSize: "40px",
                      marginTop: "10px",
                    }}
                  >
                    {currentUser.username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tumbleNewsSection"></div>
      </div>
    </React.Fragment>
  );
};
