
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { createContext } from "react";

export interface ICurrentWspContext {
    currentWorkSpace: IWspUser | undefined,
    setCurrentWorkSpace: React.Dispatch<React.SetStateAction<IWspUser | undefined>>,
}

export const CurrentWorkSpaceContext = createContext<ICurrentWspContext>({
    currentWorkSpace: undefined,
    setCurrentWorkSpace: () => { }
})