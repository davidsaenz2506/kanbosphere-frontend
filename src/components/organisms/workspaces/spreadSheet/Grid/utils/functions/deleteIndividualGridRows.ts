import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { UpdateWorkSpace } from "@/services/workspaces/update";


export async function deleteIndividualGridRow(rowIndex: number | undefined, currentWorkSpace: ICurrentWspContext, toastNotification: any) {
    try {
        const spreadData =
            currentWorkSpace.currentWorkSpace.spreadSheetData?.data ?? [];
        const currentRowIndex: number | undefined = rowIndex;

        let newSpreadData: ISpreadSheet | undefined =
            currentWorkSpace.currentWorkSpace.spreadSheetData;

        spreadData.forEach((item, index: number) => {
            if (index === currentRowIndex) spreadData.splice(index, 1);
        });

        if (newSpreadData) newSpreadData.data = spreadData;

        currentWorkSpace.setCurrentWorkSpace({
            ...currentWorkSpace.currentWorkSpace,
            spreadSheetData: newSpreadData,
        });

        toastNotification({
            title: "Correcto",
            description: "¡Fila borrada de la base de datos de Tumble!",
            status: "success",
            duration: 4000,
            isClosable: true,
        });

        await UpdateWorkSpace(currentWorkSpace.currentWorkSpace);
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