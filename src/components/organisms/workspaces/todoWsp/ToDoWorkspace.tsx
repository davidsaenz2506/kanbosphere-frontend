import React, { useState } from "react";
import ToDoLanes from "./utils/ToDoLanes";

import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import AddTask from "../../modals/AddTask";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { getFirstName } from "@/utilities/getFirstName";
import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";

const ToDoWorkspace = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const computedUserDataField: ICurrentUserContext = useCurrentUser();

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
      style={{ width: "100%", overflowX: "scroll", overflowY: "hidden" }}
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
            }}
          >
            Bienvenido a tu espacio de trabajo To Do{" "}
            {getFirstName(computedUserDataField.currentUser.fullname)}!
          </h2>
          <p style={{ textAlign: "start", marginLeft: "32px" }}>
            Aqui podras revisar tus tareas de trabajo y gestionarlas.
          </p>
        </div>
        <div style={{ marginRight: "20px" }}>
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
