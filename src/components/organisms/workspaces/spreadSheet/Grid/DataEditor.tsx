import React, { useCallback } from "react";
import {
  Item,
  GridCell,
  GridCellKind,
  GridColumn,
} from "@glideapps/glide-data-grid";
import { DataEditor } from "@glideapps/glide-data-grid";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

interface ISpreadProps {
  data: any;
}

const GridDataEditor = (Props: ISpreadProps) => {
  const { data } = Props;
  const currentUserWsp = useCurrentWorkspace();
  const columns =
    currentUserWsp.currentWorkSpace.spreadSheetData?.columns ?? [];

  function getData([col, row]: Item): GridCell {
    const dataRow = data[row];
    const columnsCol = columns[col];
    const field = columnsCol?.title;

    return {
      kind: GridCellKind.Text,
      data: dataRow[field] ?? "",
      allowOverlay: true,
      displayData: dataRow[field] ?? "",
    };
  }

  const onCellEdited = useCallback((cell, newValue) => {
    const [col, row] = cell;
    const key = columns[col]?.title;

    data[row][key] = newValue.data;
  }, [columns]);

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
        rowMarkers="both"
        rows={data.length}
        getCellContent={getData}
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
