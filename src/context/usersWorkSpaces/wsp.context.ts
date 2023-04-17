import { IWspUser } from "@/domain/entities/userWsps.entity";
import { createContext } from "react";

export interface IWspContext {
    userWsps: IWspUser[],
    setUsersWsps: (value: any) => void,
    fetchWorkSpaces: (userId: string) => Promise<void>
}

export const WorkspaceContext = createContext<IWspContext>({
    userWsps: [],
    setUsersWsps: () => {},
    fetchWorkSpaces: async () => {}
})