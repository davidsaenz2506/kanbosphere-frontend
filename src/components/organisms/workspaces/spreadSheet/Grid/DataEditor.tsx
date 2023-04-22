import React, { useCallback } from "react";
import { Item, GridCell, EditableGridCell } from "@glideapps/glide-data-grid";
import { DataEditor } from "@glideapps/glide-data-grid";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { editGridCell } from "./utils/onCellEdites";
import { getCellData } from "./utils/getCellData";
import { useCustomCells } from "@glideapps/glide-data-grid";

import Date from "./fields/date";

interface ISpreadProps {
  data: any;
}

const GridDataEditor = (Props: ISpreadProps) => {
  const { data } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const columns: IColumnProjection[] =
    currentUserWsp.currentWorkSpace.spreadSheetData?.columns ?? [];

  const CustomCells = useCustomCells([Date]);

  const getUserData = useCallback(
    ([col, row]: Item): GridCell => getCellData([col, row], data, columns),
    [data, columns]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      editGridCell(cell, columns, data, newValue, currentUserWsp);
    },
    [columns, data]
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
        columns={columns}
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
