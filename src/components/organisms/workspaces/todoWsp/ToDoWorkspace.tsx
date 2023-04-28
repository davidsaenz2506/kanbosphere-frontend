import React, { useState } from "react";
import ToDoLanes from "./utils/ToDoLanes";

import { Box, Button } from "@chakra-ui/react";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import AddTask from "../../modals/AddTask";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

import { Popover } from "@nextui-org/react";
import styles from "../../../../styles/interfaces/pages/workspace.module.css";

const ToDoWorkspace = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const { currentWorkSpace } = useCurrentWorkspace();
  const [currentColor, setCurrentColor] = useState<string>("#b9ccde");
  const [isOpen, setIsOpen] = useState(false);
  const colorObject = {
    "Default color": "#b9ccde",
    "Blue gradient":
      "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "Spreadsheet wallpaper":
      "linear-gradient(90deg, rgba(127,179,216,1) 2%, rgba(78,199,223,1) 48%, rgba(170,160,223,1) 97%)",
    "Dark mode":
      "linear-gradient(90deg, rgba(32,44,57,1) 0%, rgba(66,97,104,1) 100%)",
  };

  window.onresize = function onResize() {
    const todoDocument: HTMLDivElement | null =
      document.querySelector(".todoContainer");
    const navBarDocument: any = document.getElementById("navbarHome");

    if (todoDocument && bodyDocument) {
      todoDocument.style.height = `${
        bodyDocument.getBoundingClientRect().height -
        navBarDocument.getBoundingClientRect().height
      }px`;
    }
  };

  React.useEffect(() => {
    const InitialTodoDocument: HTMLDivElement | null =
      document.querySelector(".todoContainer");
    const InitialNavBarDocument: any = document.getElementById("navbarHome");

    if (InitialTodoDocument && bodyDocument) {
      InitialTodoDocument.style.height = `${
        bodyDocument.getBoundingClientRect().height -
        InitialNavBarDocument.getBoundingClientRect().height
      }px`;
    }
  });

  return (
    <div
      className="todoContainer"
      style={{
        width: "100%",
        overflowX: "scroll",
        overflowY: "hidden",
        background: currentColor,
      }}
    >
      <AddTask isOpen={addTask} onClose={setAddTask} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          height: "12%",
          left: 0,
        }}
      >
        <div className="header">
          <h2
            style={{
              textAlign: "start",
              marginTop: "20px",
              marginLeft: "30px",
              color: "whitesmoke",
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

          <Button onClick={() => setAddTask(true)}>
            <AddIcon sx={{ marginRight: "10px" }} />
            Añadir pendiente
          </Button>
        </div>
      </div>
      <div style={{ height: "90%" }}>
        <ToDoLanes />
      </div>
    </div>
  );
};

export default ToDoWorkspace;
