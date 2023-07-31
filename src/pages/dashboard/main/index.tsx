import React from "react";

import styles from "./main.module.css";

import { Box } from "@chakra-ui/react";
import Projections from "@/components/Projection";

export const MainLoad = ({ loadingServerData }) => {
  return (
    <React.Fragment>
      <div className={styles.mainContainer}>
        <Box>
          <Box sx={{ width: "100%", marginBottom: "80px" }}>
            <Projections loadingServerData={loadingServerData} />
          </Box>
        </Box>
      </div>
    </React.Fragment>
  );
};
