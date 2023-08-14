import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteGridRow(rowIndex: number[] | undefined, currentWorkSpace: ICurrentWspContext, toastNotification: any) {
    try {
        const spreadData = currentWorkSpace?.currentWorkSpace?.container?.spreadSheetData?.data ?? [];
        const currentRowIndex: number[] | undefined = rowIndex;

        const newSpreadData: ISpreadSheet | undefined = currentWorkSpace?.currentWorkSpace?.container?.spreadSheetData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredDataSheet: any[] = spreadData.filter((item: any[], index: number) => !currentRowIndex?.includes(index));

        if (newSpreadData) newSpreadData.data = filteredDataSheet;

        if (currentWorkSpace.currentWorkSpace) currentWorkSpace.setCurrentWorkSpace({ ...currentWorkSpace.currentWorkSpace, container: {
            ...currentWorkSpace.currentWorkSpace.container,
            spreadSheetData: newSpreadData
        }});


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