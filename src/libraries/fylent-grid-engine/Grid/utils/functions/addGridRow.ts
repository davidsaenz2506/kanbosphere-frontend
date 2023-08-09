import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { IColumnProjection, ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { UpdateWorkSpace } from "@/services/workspaces/update";


export async function addGridRow(currentWorkSpace: ICurrentWspContext) {
    const tumbleSpreadRow = {};
    const userColumns: IColumnProjection[] | undefined = currentWorkSpace?.currentWorkSpace?.spreadSheetData?.columns;

    userColumns?.forEach((individualColumn) => {
        if (!tumbleSpreadRow.hasOwnProperty(individualColumn?.title)) {
            tumbleSpreadRow[individualColumn?.title] = "";
        }
    });

    let newSpreadData: ISpreadSheet | undefined = currentWorkSpace?.currentWorkSpace?.spreadSheetData;

    // @ts-ignore
    newSpreadData?.data?.push(tumbleSpreadRow);

    if (currentWorkSpace.currentWorkSpace) {
        currentWorkSpace.setCurrentWorkSpace({
            ...currentWorkSpace.currentWorkSpace,
            spreadSheetData: newSpreadData,
        });
    }

}