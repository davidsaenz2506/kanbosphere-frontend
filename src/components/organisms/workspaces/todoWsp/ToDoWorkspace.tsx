import React, { useState } from "react";
import ToDoLanes from "./utils/ToDoLanes";

import AddTask from "../../modals/AddTask";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import Header from "./utils/Header";
import initResizer from "@/utilities/resizePage";

const ToDoWorkspace = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const { currentWorkSpace } = useCurrentWorkspace();
  const [currentColor, setCurrentColor] = useState<string>("#FAFAFA");
  const [resizeListener, setResizeListener] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isBrowser = () => typeof window !== "undefined";
  const colorObject = {
    "Default color": "#FAFAFA",
    Bone: "#F8F8F8",
    Marfil: "#FAFAFA",
  };

  if (isBrowser()) {
    window.onresize = function onResize() {
      const todoDocument: HTMLDivElement | null =
        document.querySelector(".todoContainer");
      const navBarDocument: any = document.getElementById("navbarHome");
      const bodyDocumentData: HTMLBodyElement | null =
        document.querySelector("body");

      const workSpaceContainer = document.getElementById("workSpace");

      const resizetToolData: HTMLElement | null =
        document.getElementById("resizerTool");

      setResizeListener(Math.random() * 10 - 1 + 1);

      if (
        todoDocument &&
        bodyDocument &&
        bodyDocumentData &&
        resizetToolData &&
        workSpaceContainer
      ) {
        todoDocument.style.height = `${
          bodyDocument.getBoundingClientRect().height -
          navBarDocument.getBoundingClientRect().height
        }px`;

        workSpaceContainer.style.width = "100%";
      }
    };
  }

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

  React.useEffect(() => {
    var resizerTool = document.getElementById("resizerTool");
    var toolSpace = document.getElementById("toolSpace");
    var workSpace = document.getElementById("workSpace");

    initResizer(resizerTool, toolSpace, workSpace);
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
          currentColor={currentColor}
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
