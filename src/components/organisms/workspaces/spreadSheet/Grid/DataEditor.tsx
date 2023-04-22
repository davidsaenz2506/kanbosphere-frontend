import React, { useCallback } from "react";
import {
  Item,
  GridCell,
  EditableGridCell,
  GridColumn,
} from "@glideapps/glide-data-grid";
import { DataEditor } from "@glideapps/glide-data-grid";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { editGridCell } from "./utils/onCellEdites";
import { getCellData } from "./utils/getCellData";
import { useCustomCells } from "@glideapps/glide-data-grid";

import Date from "./fields/date";
import PickList from "./fields/picklist";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { sendNewColumnsToServer } from "./utils/functions/sendColumnsToServet";

interface ISpreadProps {
  data: any;
}

const GridDataEditor = (Props: ISpreadProps) => {
  const { data } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const currentUser = useCurrentUser();
  const columns: IColumnProjection[] =
    currentUserWsp.currentWorkSpace.spreadSheetData?.columns ?? [];

  const [userColumns, setUserColumns] =
    React.useState<IColumnProjection[]>(columns);

  const CustomCells = useCustomCells([Date, PickList]);

  React.useEffect(() => {
    setUserColumns(columns);
  }, [columns]);

  const getUserData = useCallback(
    ([col, row]: Item): GridCell => getCellData([col, row], data, userColumns),
    [data, userColumns]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      editGridCell(cell, userColumns, data, newValue, currentUserWsp);
    },
    [userColumns, data]
  );

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
        {...CustomCells}
        rowMarkers="both"
        rows={data.length}
        getCellContent={getUserData}
        width={"100%"}
        height={"100%"}
        smoothScrollX={true}
        smoothScrollY={true}
      />
      <div id="portal" />
    </div>
  );
};

export default GridDataEditor;
