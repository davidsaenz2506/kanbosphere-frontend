import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { GridCell, GridCellKind, Item } from "@glideapps/glide-data-grid";
import { DateTime } from "luxon";

export const getCellData = (
    [col, row]: Item,
    data: any,
    columns: IColumnProjection[]
): GridCell => {
    const dataRow: any = data[row];
    const columnsCol: IColumnProjection = columns[col];
    const columnType: string | undefined = columnsCol.type;
    const field: string = columnsCol?.title;

    if (columnType === "string")
        return {
            kind: GridCellKind.Text,
            data: dataRow[field] ?? "",
            allowOverlay: true,
            displayData: dataRow[field] ?? "",
        };

    if (columnType === "boolean")
        return {
            kind: GridCellKind.Boolean,
            data: dataRow[field] || false,
            allowOverlay: false,
        };

    if (columnType === "number")
        return {
            kind: GridCellKind.Number,
            data: dataRow[field] ?? "",
            allowOverlay: true,
            displayData: dataRow[field].toString() ?? "",
        };

    if (columnType === "date") {
        const newUserDate = new Date(new Date(dataRow[field])).toUTCString();
        const jsonDate = new Date(newUserDate).toJSON();

        let renderDateFromServer = "";

        if (jsonDate) {
            renderDateFromServer = DateTime.fromSQL(jsonDate.split("T")[0]).toFormat("DDD");
        }

        return {
            kind: GridCellKind.Custom,
            data: {
                type: "date",
                date: dataRow[field] !== "" ? dataRow[field] : "",
                displayDate: !dataRow[field] ? "" : renderDateFromServer,
                format: "date",
            },
            allowOverlay: true,
            copyData: "",
        };
    } else
        return {
            kind: GridCellKind.Text,
            data: dataRow[field] ?? "",
            allowOverlay: true,
            displayData: dataRow[field] ?? "",
        };
};
