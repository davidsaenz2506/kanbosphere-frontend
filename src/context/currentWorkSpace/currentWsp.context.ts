
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { createContext } from "react";

export interface ICurrentWspContext {
    currentWorkSpace: IWspUser[],
    setCurrentWorkSpace: (value: any) => void,
}


export const CurrentWorkSpaceContext = createContext<ICurrentWspContext>({
    currentWorkSpace: [],
    setCurrentWorkSpace: () => {}
})