import React, { useCallback, useState } from "react";
import {
  Item,
  GridCell,
  EditableGridCell,
  GridColumn,
  CompactSelection,
  GridSelection,
  Theme,
} from "@glideapps/glide-data-grid";
import { DataEditor } from "@glideapps/glide-data-grid";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { editGridCell } from "./utils/onCellEdites";
import { getCellData } from "./utils/getCellData";
import { useCustomCells } from "@glideapps/glide-data-grid";

import Date from "./fields/date";
import PickList from "./fields/picklist";
import Multipicklist from "./fields/multipicklist";
import Time from "./fields/time";
import Phone from "./fields/phone";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { sendNewColumnsToServer } from "./utils/functions/sendColumnsToServet";

import { useToast } from "@chakra-ui/react";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { ICollaborators } from "@/domain/entities/userWsps.entity";

interface ISpreadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isAutoSaveModeActive: boolean;
  internalTriggerPointer: number;
  setCurrentRowsSelected: React.Dispatch<React.SetStateAction<number[]>>;
  handleChangeEvent: () => Promise<void>;
  currentSelection: GridSelection | undefined;
  setCurrentSelection: React.Dispatch<
    React.SetStateAction<GridSelection | undefined>
  >;
  freezeColumns: number;
  useTheme: Partial<Theme>;
}

const GridDataEditor = (Props: ISpreadProps) => {
  const {
    data,
    setCurrentRowsSelected,
    internalTriggerPointer,
    isAutoSaveModeActive,
    currentSelection,
    freezeColumns,
    useTheme,
    setCurrentSelection,
    handleChangeEvent,
  } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const currentUserWorkspaces = useWorkspace();
  const currentUser = useCurrentUser();
  const toastNotification = useToast();
  const [triggerRearrangeEvent, setTriggerRearrangeEvent] = useState<number>(0);

  const selection: GridSelection = {
    current: undefined,
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  };

  const [userSelection, setUserSelection] =
    React.useState<GridSelection>(selection);
  const [userColumns, setUserColumns] = React.useState<IColumnProjection[]>(
    currentUserWsp?.currentWorkSpace?.container?.spreadSheetData?.columns ?? []
  );
  const containerPreferences =
    currentUserWsp.currentWorkSpace?.collaborators.find(
      (currentCollaborator: ICollaborators) =>
        currentCollaborator._id === currentUser.currentUser._id
    )?.containerPreferences;

  const CustomCells = useCustomCells([
    Date,
    PickList,
    Multipicklist,
    Time,
    Phone,
  ]);

  React.useEffect(() => {
    if (currentUserWsp?.currentWorkSpace?.container?.spreadSheetData?.columns) {
      const sortedColumns: IColumnProjection[] =
        currentUserWsp?.currentWorkSpace?.container?.spreadSheetData?.columns.sort(
          (a, b) => a.order - b.order
        );
      setUserColumns(sortedColumns);
    }
  }, [
    currentUserWsp?.currentWorkSpace?.container?.spreadSheetData?.columns,
    internalTriggerPointer,
  ]);

  const getUserData = useCallback(
    ([col, row]: Item): GridCell => getCellData([col, row], data, userColumns),
    [
      data,
      userColumns,
      internalTriggerPointer,
      currentUserWorkspaces.userWsps,
      currentUserWsp.currentWorkSpace,
    ]
  );

  function handleStateForNotificationSnack(staticValueFromServer: boolean) {
    if (!staticValueFromServer)
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Asegúrate de ingresar los datos correctamente",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
  }

  const onColumnsMoved = (startIndex: number, endIndex: number) => {
    const newColumns = [...userColumns];
    const [toMove] = newColumns.splice(startIndex, 1);
    newColumns.splice(endIndex, 0, toMove);

    const assignNewOrderValues: IColumnProjection[] = newColumns.map(
      (currentChild: IColumnProjection, index: number) => {
        return { ...currentChild, order: index };
      }
    );

    setUserColumns(assignNewOrderValues);
    sendNewColumnsToServer(
      currentUserWsp,
      currentUser,
      assignNewOrderValues,
      currentUserWsp.currentWorkSpace?.container?.spreadSheetData?.data ?? []
    );
    setTriggerRearrangeEvent(Math.floor(Math.random() * 999) + 1);
  };

  const onCellEdited = useCallback(
    async (cell: Item, newValue: EditableGridCell) => {
      const validationExportedFromUtils: boolean = await editGridCell(
        cell,
        userColumns,
        currentUserWsp.currentWorkSpace?.container?.spreadSheetData?.data,
        newValue
      );

      if (isAutoSaveModeActive) handleChangeEvent();
      handleStateForNotificationSnack(validationExportedFromUtils);
    },
    [userColumns, data]
  );

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const transformItemObjectToArray = userSelection.rows?.items.length ? userSelection.rows?.items : undefined;
    const iterateObjectPlanning: number[][] = transformItemObjectToArray?.map(
      (currentMappedBox: number[]) => {
        const indexValues: number[] = [];
        for (let i = currentMappedBox[0]; i < currentMappedBox[1]; i++) {
          indexValues.push(i);
        }

        return indexValues;
      }
    );

    if (iterateObjectPlanning === undefined) return;

    const reducedObject: number[] = ([] as number[]).concat(
      ...iterateObjectPlanning
    );

    setCurrentRowsSelected(reducedObject);
  }, [userSelection.rows]);

  React.useEffect(() => {
    if (currentSelection === undefined) {
      setUserSelection({ ...userSelection, current: undefined });
    }
  }, [currentSelection]);

  React.useEffect(() => {
    if (isAutoSaveModeActive) handleChangeEvent();
  }, [triggerRearrangeEvent]);

  return (
    <div
      id="grid-engine"
      style={{
        borderTop: "2px solid #A0A0B8",
        borderBottom: "2px solid #A0A0B8",
        overflow: "auto",
        height: "100%",
      }}
    >
      <DataEditor
        onColumnMoved={async (startIndex: number, endIndex: number) => {
          onColumnsMoved(startIndex, endIndex);
        }}
        columns={
          userColumns.length === 0
            ? [
                {
                  title:
                    "Find out if there is a property of the column to replace in case of undefined",
                  width: 0,
                },
              ]
            : userColumns
        }
        onColumnResize={(
          column: GridColumn,
          newSize: number,
          colIndex: number
        ) => {
          const newColumnsWithMechanicalWidth: IColumnProjection[] =
            userColumns.map(
              (individualColumn: IColumnProjection, index: number) => {
                if (index === colIndex) individualColumn.width = newSize;
                return individualColumn;
              }
            );

          setUserColumns(newColumnsWithMechanicalWidth);
        }}
        onColumnResizeEnd={() => {
          sendNewColumnsToServer(
            currentUserWsp,
            currentUser,
            userColumns,
            currentUserWsp.currentWorkSpace?.container?.spreadSheetData?.data ??
              []
          );

          if (isAutoSaveModeActive) handleChangeEvent();
        }}
        onCellEdited={onCellEdited}
        onGridSelectionChange={(e: GridSelection) => {
          setCurrentSelection(e);
          setUserSelection(e);
        }}
        {...CustomCells}
        rowMarkers={
          currentUserWsp.currentWorkSpace &&
          containerPreferences &&
          "isRowSelectionActive" in containerPreferences
            ? containerPreferences?.isRowSelectionActive
              ? "both"
              : "none"
            : "none"
        }
        rows={data.length ?? 0}
        getCellContent={getUserData}
        rowSelectionMode={
          currentUserWsp.currentWorkSpace &&
          containerPreferences &&
          "isMultipleSelectionActive" in containerPreferences
            ? containerPreferences?.isMultipleSelectionActive
              ? "multi"
              : "auto"
            : "auto"
        }
        width={"100%"}
        theme={useTheme}
        height={"100%"}
        smoothScrollX={true}
        smoothScrollY={true}
        freezeColumns={freezeColumns}
        gridSelection={userSelection}
        key={internalTriggerPointer}
      />
      <div id="portal" />
    </div>
  );
};

export default GridDataEditor;
