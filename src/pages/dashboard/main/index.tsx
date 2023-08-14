import React from "react";

import styles from "./main.module.css";

import { Box } from "@chakra-ui/react";
import Projections from "@/components/Projection";

interface IMainLoadProps {
  loadingServerData: boolean;
}

export const MainLoad: React.FunctionComponent<IMainLoadProps> = (props) => {
  const { loadingServerData } = props;
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
