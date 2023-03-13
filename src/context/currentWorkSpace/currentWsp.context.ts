
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { createContext } from "react";

const { DateTime } = require("luxon");

export interface ICurrentWspContext {
    currentWorkSpace: IWspUser,
    setCurrentWorkSpace: (value: any) => void,
}

export const CurrentWorkSpaceContext = createContext<ICurrentWspContext>({
    currentWorkSpace: {
        userId: "",
        name: "",
        createdDate: DateTime.now() ,
        createdById: "",
        type: "",
        wspData: []
    },
    setCurrentWorkSpace: () => {}
})