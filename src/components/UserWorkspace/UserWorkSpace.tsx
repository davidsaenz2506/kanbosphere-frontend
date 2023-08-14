import React from "react";
import styles from "../../styles/interfaces/pages/userwsp.module.css";

import Cards from "../Cards/Cards";
import { Box, Text } from "@chakra-ui/react";

import confetti from "canvas-confetti";

const UserWorkSpace = () => {

  function handleConfettiAction() {
    confetti({
      particleCount: 3000,
      spread: 360,
      origin: { y: 1.4 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00', '#ff9900', '#9900ff', '#00ffff', '#ff0066', '#66ff00', '#0066ff'],
      angle: 360,
      startVelocity: 110,
      ticks: 700,
      gravity: 2
    });
  }

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
      <Cards handleConfettiAction={handleConfettiAction} />
    </Box>
  );
};

export default UserWorkSpace;
