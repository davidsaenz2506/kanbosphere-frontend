import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { IColumnProjection, ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { IWspUser } from "@/domain/entities/userWsps.entity";

export function setSpreadColumns(
  data: IWspUser,
  setUserTasks: React.Dispatch<React.SetStateAction<IWspUser | undefined>>,
  setCurrentSpreadData: React.Dispatch<React.SetStateAction<ISpreadSheet | undefined>>,
  newColumn: IColumnProjection,
  performanceWorkspaces: IWspContext,
) {
  let newUserRows: [] = [];

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

  const currentWorkspaces: IWspUser[] = performanceWorkspaces.userWsps;
  const updatedWorkspaces = currentWorkspaces.map((bookRow: IWspUser) => {
    if (bookRow._id === data._id) {
      return data;
    } else return bookRow;
  });

  performanceWorkspaces.setUsersWsps(updatedWorkspaces);

  if (data.spreadSheetData) {
    setCurrentSpreadData({
      columns: [...(data?.spreadSheetData.columns), newColumn],
      data: newUserRows,
      userId: data.spreadSheetData?.userId ?? data.createdById,
    });
  }

}
