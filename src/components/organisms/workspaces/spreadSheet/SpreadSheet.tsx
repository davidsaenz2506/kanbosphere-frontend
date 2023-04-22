import React, { useState } from "react";

import { Button } from "@chakra-ui/react";
import { AddIcon, ExternalLinkIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { getFirstName } from "@/utilities/getFirstName";

import "@glideapps/glide-data-grid/dist/index.css";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import GridDataEditor from "./Grid/DataEditor";
import CreateColumn from "../../modals/Spread/AddColumn";

const Spreadsheet = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const currentWorkSpace = useCurrentWorkspace();
  const userColumns =
    currentWorkSpace.currentWorkSpace?.spreadSheetData?.columns;
  const computedUserDataField = useCurrentUser();

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

  function addGridRow() {
    const tumbleSpreadRow = {};
    const userColumns =
      currentWorkSpace.currentWorkSpace.spreadSheetData?.columns;

    userColumns?.forEach((individualColumn) => {
      if (!tumbleSpreadRow.hasOwnProperty(individualColumn?.title)) {
        tumbleSpreadRow[individualColumn?.title] = "";
      }
    });

    let newSpreadData = currentWorkSpace.currentWorkSpace.spreadSheetData;

    // @ts-ignore
    newSpreadData?.data?.push(tumbleSpreadRow);

    currentWorkSpace.setCurrentWorkSpace({
      ...currentWorkSpace.currentWorkSpace,
      spreadSheetData: newSpreadData,
    });
  }

  React.useEffect(() => {
    if (currentWorkSpace.currentWorkSpace.spreadSheetData?.data) {
      const dataMatrix =
        currentWorkSpace.currentWorkSpace.spreadSheetData?.data;
      let newUserRows = [];
      let newSpreadData = currentWorkSpace.currentWorkSpace.spreadSheetData;

      dataMatrix.forEach((individualRow: object) => {
        currentWorkSpace.currentWorkSpace.spreadSheetData?.columns.forEach(
          (userColumn) => {
            if (!individualRow.hasOwnProperty(userColumn?.title)) {
              individualRow[userColumn?.title] = "";
            }
          }
        );
        // @ts-ignore
        newUserRows.push(individualRow);
      });

      // @ts-ignore
      newSpreadData.data = newUserRows;

      currentWorkSpace.setCurrentWorkSpace({
        ...currentWorkSpace.currentWorkSpace,
        spreadSheetData: newSpreadData,
      });
    }
  }, [userColumns]);

  console.log(currentWorkSpace.currentWorkSpace.spreadSheetData)

  return (
    <div
      className="todoContainer"
      style={{ width: "100%", overflowX: "scroll", overflowY: "hidden" }}
    >
      <CreateColumn isOpen={addTask} onClose={setAddTask} />
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
            }}
          >
            Spreadsheet de{" "}
            {getFirstName(computedUserDataField.currentUser.fullname)}
          </h2>
          <p style={{ textAlign: "start", marginLeft: "32px" }}>
            Almacena y exporta datos con Tumble Spreadsheet
          </p>
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
            <Button onClick={() => addGridRow()}>
              <PlusSquareIcon sx={{ marginRight: "10px" }} />
              Añadir fila
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
        />
      </div>
    </div>
  );
};

export default Spreadsheet;
