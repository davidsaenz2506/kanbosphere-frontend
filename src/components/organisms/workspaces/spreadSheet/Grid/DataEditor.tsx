import React, { useCallback, useRef } from "react";
import {
  Item,
  GridCell,
  EditableGridCell,
  GridColumn,
  CompactSelection,
  GridSelection,
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

interface ISpreadProps {
  data: any;
  internalTriggerPointer: number;
  setCurrentRowsSelected: any;
  freezeColumns: any
}

const GridDataEditor = (Props: ISpreadProps) => {
  const { data, setCurrentRowsSelected, internalTriggerPointer, freezeColumns } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const currentUser = useCurrentUser();
  const toastNotification = useToast();
  const columns: IColumnProjection[] =
    currentUserWsp.currentWorkSpace.spreadSheetData?.columns ?? [];

  const selection: GridSelection = {
    current: undefined,
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  };

  const [userSelection, setUserSelection] =
    React.useState<GridSelection>(selection);

  const [userColumns, setUserColumns] =
    React.useState<IColumnProjection[]>(columns);

  const CustomCells = useCustomCells([Date, PickList, Multipicklist]);

  React.useEffect(() => {
    setUserColumns(columns);
  }, [columns]);

  const getUserData = useCallback(
    ([col, row]: Item): GridCell => getCellData([col, row], data, userColumns),
    [data, userColumns, internalTriggerPointer]
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
    else
      toastNotification({
        title: "Correcto",
        description:
          "¡Sus datos se han guardado con éxito en la base de datos de Tumble!",
        status: "success",
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
      setCurrentRowsSelected(userSelection.rows?.items.length ? userSelection.rows?.items[0][0] : undefined);
  }, [userSelection.rows]);


  return (
    <div
      style={{
        border: "2px solid #577080",
        borderRadius: "10px",
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
          setUserSelection(e);
        }}
        {...CustomCells}
        rowMarkers="both"
        rows={data.length}
        getCellContent={getUserData}
        width={"100%"}
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
