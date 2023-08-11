import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { IWspUser } from "@/domain/entities/userWsps.entity";

export function handleAndUpdateAllWorkspacesAfterDatabaseChange(updatedWorkspace: IWspUser, workspacesHook: IWspContext) {
    const currentUserWorkspaces: IWspUser[] = workspacesHook.userWsps;
    const currentUpdatedWorkspace: IWspUser = updatedWorkspace;
    const newUserWorkspaces: IWspUser[] = currentUserWorkspaces.map((currentChunk: IWspUser) => {
             if (currentChunk._id === currentUpdatedWorkspace._id) return currentUpdatedWorkspace;
             return currentChunk;
    })

    workspacesHook.setUsersWsps(newUserWorkspaces);
}