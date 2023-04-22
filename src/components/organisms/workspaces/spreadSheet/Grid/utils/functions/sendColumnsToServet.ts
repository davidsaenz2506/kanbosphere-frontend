import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { IColumnProjection, ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { UpdateWorkSpace } from "@/services/workspaces/update";

export async function sendNewColumnsToServer(currentUserWsp: ICurrentWspContext, currentUser: ICurrentUserContext, userColumns: IColumnProjection[], data: any) {
    const currentWorkspaceData: IWspUser = currentUserWsp.currentWorkSpace;
    const newSpreadsheetData: ISpreadSheet = {
      userId:
        currentWorkspaceData.spreadSheetData?.userId ??
        currentUser.currentUser.userID,
      columns: userColumns,
      data: data,
    };

    currentUserWsp.setCurrentWorkSpace({
      ...currentWorkspaceData,
      spreadSheetData: newSpreadsheetData,
    });

    await UpdateWorkSpace(currentUserWsp.currentWorkSpace);
  }