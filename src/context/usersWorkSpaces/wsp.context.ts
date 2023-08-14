import { IWspUser } from "@/domain/entities/userWsps.entity";
import { createContext } from "react";

export interface IWspContext {
    userWsps: IWspUser[],
    setUsersWsps: (value: IWspUser[]) => void,
    fetchWorkSpaces: (userId: string, setLoadingServerData?: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>
}

export const WorkspaceContext = createContext<IWspContext>({
    userWsps: [],
    setUsersWsps: () => {},
    fetchWorkSpaces: async () => {}
})