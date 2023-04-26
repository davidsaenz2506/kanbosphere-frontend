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

    switch (columnType) {
        case "string":
            return {
                kind: GridCellKind.Text,
                data: dataRow[field] ?? "",
                allowOverlay: true,
                displayData: dataRow[field] ?? "",
            };

        case "boolean":
            return {
                kind: GridCellKind.Boolean,
                data: dataRow[field] || false,
                allowOverlay: false,
            };

        case "number":
            return {
                kind: GridCellKind.Number,
                data: dataRow[field] ?? "",
                allowOverlay: true,
                displayData: dataRow[field]?.toString() ?? "",
            };

        case "date":
            const newUserDate = new Date(new Date(dataRow[field])).toUTCString();
            const jsonDate = new Date(newUserDate).toJSON();

            let renderDateFromServer = "";

            if (jsonDate) {
                renderDateFromServer = DateTime.fromSQL(
                    jsonDate.split("T")[0]
                ).toFormat("DDD");
            }

            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "date",
                    date: dataRow[field] ? dataRow[field] : DateTime.now(),
                    displayDate: !dataRow[field] ? "" : renderDateFromServer,
                    format: "date",
                },
                allowOverlay: true,
                copyData: "",
            };

        case "picklist":
            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "picklist",
                    value: dataRow[field] ?? "",
                    allowedValues: columnsCol?.picklistValues,
                },
                allowOverlay: true,
                copyData: "",
            };

        case "multipicklist":
            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "multipicklist",
                    tags: dataRow[field] ? dataRow[field].split(";") : "",
                    possibleTags: columnsCol?.picklistValues,
                },
                allowOverlay: true,
                copyData: "",
            }

        default:
            return {
                kind: GridCellKind.Text,
                data: dataRow[field] ?? "",
                allowOverlay: true,
                displayData: dataRow[field] ?? "",
            };
    }
};
