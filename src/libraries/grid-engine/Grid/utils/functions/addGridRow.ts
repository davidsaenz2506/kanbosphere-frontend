import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { IColumnProjection, ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

export async function addGridRow(currentWorkSpace: ICurrentWspContext) {
    const tumbleSpreadRow = {};
    const userColumns: IColumnProjection[] | undefined = currentWorkSpace?.currentWorkSpace?.container?.spreadSheetData?.columns;

    userColumns?.forEach((individualColumn: IColumnProjection) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!tumbleSpreadRow.hasOwnProperty(individualColumn?.title)) {
            tumbleSpreadRow[individualColumn?.title] = "";
        }
    });

    const newSpreadData: ISpreadSheet | undefined = currentWorkSpace?.currentWorkSpace?.container?.spreadSheetData;

    newSpreadData?.data?.push(tumbleSpreadRow);

    if (currentWorkSpace.currentWorkSpace) {
        currentWorkSpace.setCurrentWorkSpace({
            ...currentWorkSpace.currentWorkSpace,
            container: {
                ...currentWorkSpace.currentWorkSpace.container,
                spreadSheetData: newSpreadData
            }
        });
    }

}