import React, { useState } from "react";
import ToDoLanes from "./utils/ToDoLanes";

import AddTask from "../../modals/AddTask";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import Header from "./utils/Header";

const ToDoWorkspace = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const { currentWorkSpace } = useCurrentWorkspace();
  const [currentColor, setCurrentColor] = useState<string>(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
  );
  const [isOpen, setIsOpen] = useState(false);
  const colorObject = {
    "Default color": "#364567",
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
        <Header
          currentWorkSpace={currentWorkSpace}
          setAddTask={setAddTask}
          setCurrentColor={setCurrentColor}
          setIsOpen={setIsOpen}
          colorObject={colorObject}
          isOpen
        />
      </div>
      <div style={{ height: "90%" }}>
        <ToDoLanes />
      </div>
    </div>
  );
};

export default ToDoWorkspace;
