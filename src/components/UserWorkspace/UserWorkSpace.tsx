import React from "react";
import styles from "../../styles/interfaces/pages/userwsp.module.css";

import Cards from "../Cards/Cards";
import { Box, Text } from "@chakra-ui/react";

const UserWorkSpace = () => {
  return (
    <Box className={styles.principalContainer}>
      <Text
        fontSize={"30px"}
        marginLeft={"20px"}
        marginTop={"-10px"}
        marginBottom={"10px"}
        paddingBottom={"5px"}
        textAlign={"start"}
        borderBottom={"2px dashed  #d9d9e3"}
      >
        Empieza a configurar tu contenedor 🚀
      </Text>
      <Cards />
    </Box>
  );
};

export default UserWorkSpace;
