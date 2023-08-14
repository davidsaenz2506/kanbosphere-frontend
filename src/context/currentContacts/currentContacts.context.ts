
import ICurrentUser from "@/domain/entities/user.entity";
import { createContext } from "react";

export interface ICurrentContact {
    friends: Partial<ICurrentUser[]> | undefined;
    requests: Partial<ICurrentUser[]> | undefined;
}


export interface ICurrentContactContext {
    currentContacts: ICurrentContact | null,
    setCurrentContacts: (value: ICurrentContact) => void,
}

export const CurrentContactContext = createContext<ICurrentContactContext>({
    currentContacts: null,
    setCurrentContacts: () => {},
})