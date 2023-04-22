import { ISelectColorOptions } from "@/components/organisms/modals/Spread/AddColumn";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

export function setSpreadColumns(
  data: any,
  setUserTasks: (value: any) => void,
  setCurrentSpreadData: React.Dispatch<React.SetStateAction<ISpreadSheet>>,
  newColumn: any
) {
  let newUserRows = [];

  if (data.spreadSheetData?.data) {
    const dataMatrix = data.spreadSheetData?.data;

    let newSpreadData = data.spreadSheetData;

    dataMatrix.forEach((individualRow: object) => {
      data.spreadSheetData?.columns.forEach((userColumn) => {
        if (!individualRow.hasOwnProperty(userColumn?.title)) {
          individualRow[userColumn?.title] = "";
        }
      });
      // @ts-ignore
      newUserRows.push(individualRow);
    });
    // @ts-ignore
    newSpreadData.data = newUserRows;
    setUserTasks({
      ...data,
      spreadSheetData: newSpreadData,
    });
  }

  setCurrentSpreadData({
    columns: [...(data.spreadSheetData?.columns ?? []), newColumn],
    // @ts-ignore
    data: newUserRows ?? [],
    userId: data.spreadSheetData?.userId ?? data.createdById,
  });
}
