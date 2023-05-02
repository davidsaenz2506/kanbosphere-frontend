import React, { useState } from "react";

import { Button, Portal, useToast } from "@chakra-ui/react";
import {
  AddIcon,
  ExternalLinkIcon,
  PlusSquareIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { getFirstName } from "@/utilities/getFirstName";

import "@glideapps/glide-data-grid/dist/index.css";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import GridDataEditor from "./Grid/DataEditor";
import CreateColumn from "../../modals/Spread/AddColumn";

import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";

import { deleteIndividualGridRow } from "./Grid/utils/functions/deleteIndividualGridRows";
import { addGridRow } from "./Grid/utils/functions/addGridRow";
import Loading from "@/components/molecules/Loading";
import initResizer from "@/utilities/resizePage";

const Spreadsheet = () => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const currentWorkSpace: ICurrentWspContext = useCurrentWorkspace();
  const [resizeListener, setResizeListener] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRowsSelected, setCurrentRowsSelected] = useState<number>();

  const isBrowser = () => typeof window !== "undefined";

  const toastNotification = useToast();

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
        background:
          "linear-gradient(90deg, rgba(127,179,216,1) 2%, rgba(78,199,223,1) 48%, rgba(170,160,223,1) 97%)",
      }}
    >
      <CreateColumn
        isOpen={addTask}
        onClose={setAddTask}
        setIsLoading={setIsLoading}
      />
      {isLoading && (
        <Portal>
          <Loading message="Agregando nueva columna" />
        </Portal>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          left: 0,
          height: "10%",
          marginTop: "10px",
        }}
      >
        <div className="header">
          <h2
            style={{
              textAlign: "start",
              marginTop: "20px",
              marginLeft: "30px",
              color: "whitesmoke",
            }}
          >
            {currentWorkSpace.currentWorkSpace.name}
          </h2>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "20px" }}>
            <Button
              onClick={() => {
                setAddTask(true);
              }}
            >
              <AddIcon sx={{ marginRight: "10px" }} />
              Añadir Columna
            </Button>
          </div>
          <div style={{ marginRight: "20px" }}>
            <Button onClick={() => addGridRow(currentWorkSpace)}>
              <PlusSquareIcon sx={{ marginRight: "10px" }} />
              Añadir fila
            </Button>
          </div>
          <div style={{ marginRight: "20px" }}>
            <Button
              onClick={() =>
                deleteIndividualGridRow(
                  currentRowsSelected,
                  currentWorkSpace,
                  toastNotification
                )
              }
              isDisabled={currentRowsSelected !== undefined ? false : true}
            >
              <DeleteIcon sx={{ marginRight: "10px" }} />
              Eliminar fila
            </Button>
          </div>
          <div style={{ marginRight: "20px" }}>
            <Button onClick={() => setAddTask(true)}>
              <ExternalLinkIcon sx={{ marginRight: "10px" }} />
              Exportar excel
            </Button>
          </div>
        </div>
      </div>
      <div
        className="GridContainer"
        style={{
          height: "90%",
          marginTop: "20px",
          padding: "20px",
          paddingBottom: "40px",
        }}
      >
        <GridDataEditor
          data={currentWorkSpace.currentWorkSpace.spreadSheetData?.data ?? []}
          setCurrentRowsSelected={setCurrentRowsSelected}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;
