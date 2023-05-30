import React from "react";

import { Box, Button } from "@chakra-ui/react";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";

import { Popover } from "@nextui-org/react";
import styles from "../../../../../styles/interfaces/pages/workspace.module.css";
import { IWspUser } from "@/domain/entities/userWsps.entity";

interface IHeaderProps {
  currentWorkSpace: IWspUser;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorObject: object;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  currentColor: string;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const Header = (Props: IHeaderProps) => {
  const {
    currentWorkSpace,
    setAddTask,
    setCurrentColor,
    setIsOpen,
    colorObject,
    currentColor,
    isOpen,
  } = Props;

  return (
    <React.Fragment>
      <div className="header">
        <h2
          style={{
            textAlign: "start",
            marginTop: "20px",
            marginLeft: "30px",
            color: currentColor === "#dfeeee" ? "#0E0B16" : "whitesmoke",
            fontWeight: "bold",
          }}
        >
          {currentWorkSpace.name}
        </h2>
      </div>
      <div style={{ marginRight: "20px" }}>
        <Popover isBordered disableShadow>
          <Popover.Trigger>
            <Button
              sx={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
              onClick={() => setIsOpen(!isOpen)}
              style={{ marginRight: "20px" }}
            >
              <RepeatIcon sx={{ marginRight: "10px" }} />
              Cambiar fondo
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Box style={{ padding: "20px" }}>
              <Box>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginTop: "-10px",
                    marginBottom: "20px",
                  }}
                >
                  Cambiar color de fondo
                </p>
              </Box>
              <Box>
                {Object.entries(colorObject).map((colorObjt) => {
                  return (
                    <Box
                      className={styles.individualBox}
                      style={{
                        display: "flex",
                        marginBottom: "20px",
                      }}
                      onClick={() => setCurrentColor(colorObjt[1])}
                    >
                      <Box
                        style={{
                          height: "30px",
                          width: "40px",
                          background: colorObjt[1],
                          borderRadius: "10px",
                        }}
                      ></Box>
                      <p style={{ marginLeft: "20px" }}>{colorObjt[0]} </p>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Popover.Content>
        </Popover>

        <Button
          sx={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          onClick={() => setAddTask(true)}
        >
          <AddIcon sx={{ marginRight: "10px" }} />
          Añadir pendiente
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Header;
