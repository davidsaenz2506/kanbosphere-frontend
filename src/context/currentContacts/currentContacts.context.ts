
import ICurrentUser from "@/domain/entities/user.entity";
import { IUser } from "@/domain/entities/users.entity";
import { createContext } from "react";

export interface ICurrentContact {
    friends: Partial<ICurrentUser[]> | null;
    requests: Partial<ICurrentUser[]> | null;
}


export interface ICurrentContactContext {
    currentContacts: ICurrentContact | null,
    setCurrentContacts: (value: any) => void,
}

export const CurrentContactContext = createContext<ICurrentContactContext>({
    currentContacts: null,
    setCurrentContacts: () => {},
})