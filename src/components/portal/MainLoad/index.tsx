import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import React, { useRef, useState } from "react";

import styles from "./main.module.css";

import WeatherComponent from "./WeatherComponent";
import UserComponent from "./UserComponent";
import NewsComponent from "./NewsComponent";
import { Box, Divider } from "@chakra-ui/react";

export const MainLoad = () => {
  const { currentUser }: ICurrentUserContext = useCurrentUser();
  const [isActiveClass, setIsActiveClass] = useState<boolean>(false);
  const [currentContainerHeight, setCurrentContainerRef] = useState<number>(0);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  if (currentUser.userID) {
    setTimeout(() => {
      setIsActiveClass(true);
    }, 1000);
  }

  React.useEffect(() => {
    if (
      mainContainerRef.current &&
      mainContainerRef.current.clientHeight !== currentContainerHeight
    ) {
      setCurrentContainerRef(mainContainerRef.current.clientHeight + 200);
    }
  });

  return (
    <React.Fragment>
      <div ref={mainContainerRef} className={styles.mainContainer}>
        <div className={styles.userNewsSection}>
          <div className={styles.userProps}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column-reverse",
                height: "85vh",
                justifyContent: "center",
                alignItems: "center",
                position: "sticky",
                top: 0,
                paddingTop: "35px",
              }}
            >
              <WeatherComponent />
              <UserComponent />
              <div>
                <h1
                  className={
                    isActiveClass ? styles.enableTitle : styles.disableTitle
                  }
                  style={{
                    color: "#252525",
                    fontSize: "30px",
                    padding: "10px",
                  }}
                >
                  Explore, enjoy and build
                </h1>
              </div>
            </Box>

            <Divider
              sx={{
                marginLeft: "40px",
                border: "1px solid #D3D3D3",
                height: `${currentContainerHeight}px`,
              }}
              orientation="vertical"
            />
            <Box sx={{ width: "100%" }}>
              <NewsComponent />
              <Box sx={{ textAlign: "center" }}>
                <h2 style={{fontSize: "20px"}}>®Copyright Tumble Company 2023</h2>
                <p>All rights reserved</p>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
