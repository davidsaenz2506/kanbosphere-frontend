import React, { useCallback, useRef } from "react";
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

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { sendNewColumnsToServer } from "./utils/functions/sendColumnsToServet";

import { useToast } from "@chakra-ui/react";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

interface ISpreadProps {
  data: any;
  internalTriggerPointer: number;
  setCurrentRowsSelected: any;
  setCurrentSelection: any;
  freezeColumns: any;
  useTheme: Partial<Theme>
}

const GridDataEditor = (Props: ISpreadProps) => {
  const {
    data,
    setCurrentRowsSelected,
    internalTriggerPointer,
    freezeColumns,
    useTheme,
    setCurrentSelection
  } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const currentUserWorkspaces = useWorkspace();
  const currentUser = useCurrentUser();
  const toastNotification = useToast();
  const columns: IColumnProjection[] = currentUserWsp?.currentWorkSpace?.spreadSheetData?.columns ?? [];

  const selection: GridSelection = {
    current: undefined,
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  };

  const [userSelection, setUserSelection] = React.useState<GridSelection>(selection);

  const [userColumns, setUserColumns] =
    React.useState<IColumnProjection[]>(columns);

  const CustomCells = useCustomCells([Date, PickList, Multipicklist]);

  React.useEffect(() => {
    setUserColumns(columns);
  }, [currentUserWsp.currentWorkSpace?.spreadSheetData?.columns]);

  const getUserData = useCallback(
    ([col, row]: Item): GridCell => getCellData([col, row], data, userColumns),
    [data, userColumns, internalTriggerPointer, currentUserWorkspaces.userWsps, currentUserWsp.currentWorkSpace]
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

  const onCellEdited = useCallback(
    async (cell: Item, newValue: EditableGridCell) => {
      const validationExportedFromUtils: boolean = await editGridCell(
        cell,
        userColumns,
        data,
        newValue,
        currentUserWsp
      );

      handleStateForNotificationSnack(validationExportedFromUtils);
    },
    [userColumns, data]
  );


  React.useEffect(() => {
    // @ts-ignore
    const transformItemObjectToArray = userSelection.rows?.items.length ? userSelection.rows?.items : undefined;
    const iterateObjectPlanning: number[][] = transformItemObjectToArray?.map((currentMappedBox) => {
          const indexValues: number[] = [];
          
          for (let i = currentMappedBox[0]; i < currentMappedBox[1]; i++) {
            indexValues.push(i);
          }

          return indexValues
    });

    if (iterateObjectPlanning === undefined) return
    
    const reducedObject : number[] = ([] as number[]).concat(...iterateObjectPlanning);

    setCurrentRowsSelected(reducedObject);
  }, [userSelection.rows]);
  

  return (
    <div
      style={{
        border: "2px solid #577080",
        overflow: "auto",
        height: "100%",
      }}
    >
      <DataEditor
        columns={userColumns}
        onColumnResize={(
          column: GridColumn,
          newSize: number,
          colIndex: number
        ) => {
          const newColumnsWithMechanicalWidth: IColumnProjection[] =
            columns.map(
              (individualColumn: IColumnProjection, index: number) => {
                if (index === colIndex) individualColumn.width = newSize;
                return individualColumn;
              }
            );

          setUserColumns(newColumnsWithMechanicalWidth);
        }}
        onColumnResizeEnd={() =>
          sendNewColumnsToServer(currentUserWsp, currentUser, userColumns, data)
        }
        onCellEdited={onCellEdited}
        onGridSelectionChange={(e: GridSelection) => {
          setCurrentSelection(e);
          setUserSelection(e);
        }}
        {...CustomCells}
        rowMarkers="both"
        rows={data.length}
        getCellContent={getUserData}
        width={"100%"}
        theme={useTheme}
        height={"100%"}
        smoothScrollX={true}
        smoothScrollY={true}
        freezeColumns={freezeColumns.value}
        gridSelection={userSelection}
      />
      <div id="portal" />
    </div>
  );
};

export default GridDataEditor;
