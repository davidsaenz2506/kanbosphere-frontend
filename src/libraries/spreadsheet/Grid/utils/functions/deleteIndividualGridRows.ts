import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

export async function deleteGridRow(rowIndex: number[] | undefined, currentWorkSpace: ICurrentWspContext, toastNotification: any) {
    try {
        const spreadData = currentWorkSpace.currentWorkSpace.spreadSheetData?.data ?? [];
        const currentRowIndex: number[] | undefined = rowIndex;

        let newSpreadData: ISpreadSheet | undefined = currentWorkSpace.currentWorkSpace.spreadSheetData;

        const filteredDataSheet: any = spreadData.filter((item, index: number) => !currentRowIndex?.includes(index));

        if (newSpreadData) newSpreadData.data = filteredDataSheet;

        currentWorkSpace.setCurrentWorkSpace({
            ...currentWorkSpace.currentWorkSpace,
            spreadSheetData: newSpreadData,
        });


    } catch (error) {
        toastNotification({
            title: "Ups, algo ha ocurrido...",
            description: "Asegúrate de ingresar los datos correctamente",
            status: "error",
            duration: 4000,
            isClosable: true,
        });
    }
}