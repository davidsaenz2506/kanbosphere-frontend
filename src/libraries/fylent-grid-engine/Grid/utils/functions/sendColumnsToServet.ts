import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { IColumnProjection, ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { IWspUser } from "@/domain/entities/userWsps.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendNewColumnsToServer(currentUserWsp: ICurrentWspContext, currentUser: ICurrentUserContext, userColumns: IColumnProjection[], data: any[], userWorkspaces?: IWspContext) {
  const currentWorkspaceData: IWspUser | undefined = currentUserWsp.currentWorkSpace;
  const currentWorkspaces: IWspUser[] = userWorkspaces?.userWsps ?? [];
  const newSpreadsheetData: ISpreadSheet = {
    userId:
      currentWorkspaceData?.container?.spreadSheetData?.userId ??
      currentUser.currentUser.userID,
    columns: userColumns,
    data: data,
  };

  const allWorkspacesWithModification: IWspUser[] = currentWorkspaces.map((currentSpaceContext: IWspUser) => {
    if (currentSpaceContext._id === currentWorkspaceData?._id) {
      return {
        ...currentSpaceContext,
        spreadSheetData: newSpreadsheetData,
      }
    }

    return currentSpaceContext;
  })

  if (currentWorkspaceData) {
    currentUserWsp.setCurrentWorkSpace({
      ...currentWorkspaceData,
      container: {
        ...currentWorkspaceData.container,
        spreadSheetData: newSpreadsheetData
      }
    });

    userWorkspaces?.setUsersWsps(allWorkspacesWithModification);
  }
}