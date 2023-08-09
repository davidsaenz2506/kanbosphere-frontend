import { IChildCompounds, IColumnProjection, ICompoundProjection } from "@/domain/entities/spreadsheet.entity";
import { mathematicalEnginedEncapsuled } from "@/libraries/fylent-math-engine";
import { GridCell, GridCellKind, Item } from "@glideapps/glide-data-grid";
import { DateTime } from "luxon";

export const getCellData = (
    [col, row]: Item,
    data: Array<any>,
    columns: IColumnProjection[]
): GridCell => {
    const dataRow: any = data[row];
    const columnsCol: IColumnProjection = columns[col];
    const columnType: string | undefined = columnsCol?.type;
    const field: string = columnsCol?.title;

    switch (columnType) {
        case "string":
            return {
                kind: GridCellKind.Text,
                data: dataRow[field] ? dataRow[field] : "",
                allowOverlay: true,
                displayData: dataRow[field] ? dataRow[field] : "",
            };

        case "compound":
            let currentColumnParameters: ICompoundProjection;
            let valueToRender: string | undefined;
            let currentMethod: any = undefined;

            if (columnsCol.compoundValues) {
                currentColumnParameters = columnsCol.compoundValues;

                const currentFormulaName = currentColumnParameters.formulaName;
                const parameters: IChildCompounds[] = currentColumnParameters.compounds;
                const dataEntryValues: Array<any> = parameters.map((currentEntryPoint) => {
                    return {
                        [currentEntryPoint.columnValue]: dataRow[currentEntryPoint.name]
                    }
                })

                const newEntryPoint: Object = dataEntryValues.reduce((currentChunk, object) => {
                    return {
                        ...currentChunk,
                        ...object
                    }
                }, {});


                Object.values(mathematicalEnginedEncapsuled).forEach((currentCapsule) => {
                    const extractedCapsule = Object.values(currentCapsule);
                    extractedCapsule.forEach((currentChild) => {
                        if (currentChild.value === currentFormulaName) currentMethod = currentChild.method;
                    })
                })

                valueToRender = currentMethod(newEntryPoint);
                dataRow[field] = valueToRender;
            }

            return {
                kind: GridCellKind.Text,
                data: dataRow[field] ?? "",
                allowOverlay: false,
                displayData: dataRow[field] ?? "",
            };

        case "mail":
            return {
                kind: GridCellKind.Text,
                data: dataRow[field] ? dataRow[field] : "",
                allowOverlay: true,
                displayData: dataRow[field] ? dataRow[field] : "",
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
                data: dataRow[field] ? dataRow[field] : "",
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
                    displayDate: !dataRow[field] ? "Sin establecer" : renderDateFromServer,
                    format: "date",
                },
                allowOverlay: true,
                copyData: "",
            };

        case "time":

            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "time",
                    time: dataRow[field] ? dataRow[field] : "12:00",
                    displayTime: dataRow[field] ? dataRow[field] : "Sin establecer"
                },
                allowOverlay: true,
                copyData: "",
            };

        case "calculator":

            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "calculator",
                    displayData: dataRow[field] ?? "",
                    data: dataRow[field] ?? 0
                },
                allowOverlay: true,
                copyData: ""
            };

        case "phone":

            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "phone",
                    phone: dataRow[field] ? dataRow[field] : "",
                    displayPhone: dataRow[field] ? dataRow[field] : ""
                },
                allowOverlay: true,
                copyData: "",
            };

        case "picklist":
            return {
                kind: GridCellKind.Custom,
                data: {
                    type: "picklist",
                    value: dataRow[field] ? dataRow[field] : "",
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
                data: "",
                allowOverlay: true,
                displayData: "",
            };

    }


};
