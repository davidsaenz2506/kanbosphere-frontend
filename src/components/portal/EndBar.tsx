import React, { useState } from "react";

import { Icon } from "@chakra-ui/icons";
import { CiSettings } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";

import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";

import EndSession from "../Modals/EndSession";
import styles from "../../styles/ToolButtons.module.css";
import { Box, Divider } from "@chakra-ui/react";

const EndBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EndSession isOpen={isOpen} setIsOpen={setIsOpen} router={router} />
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          paddingBottom: "10px",
          color: "#252525",
          backgroundColor: "#ffffff"
        }}
      >
        <Divider width={"86%"} marginLeft={"20px"} marginBottom={"10px"}/>
        <Box style={{ paddingRight: "25px" }} className={styles.buttonSpace}>
          <Icon as={CiSettings} w={6} h={6} sx={{ marginLeft: "15px" }} />
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "0px",
              fontSize: "15px",
            }}
            onClick={() => router.push(`/dashboard?briefcase=settings`)}
          >
            Configuración de usuario
          </button>
        </Box>
        <Box className={styles.buttonSpace}>
          <Icon as={IoExitOutline} w={5} h={5} sx={{ marginLeft: "19px" }} />
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "0px",
              fontSize: "15px",
            }}
            onClick={() => setIsOpen(true)}
          >
            Cerrar sesión
          </button>
        </Box>
      </Box>
    </>
  );
};

export default EndBar;
