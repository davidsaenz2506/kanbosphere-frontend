import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import React, { useState } from "react";

import styles from "./main.module.css";

import { Avatar } from "@chakra-ui/react";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import WeatherComponent from "./WeatherComponent";
import UserComponent from "./UserComponent";

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
            <UserComponent />
          </div>
        </div>
        <div className="tumbleNewsSection"></div>
      </div>
    </React.Fragment>
  );
};
