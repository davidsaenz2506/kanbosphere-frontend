
import ICurrentUser from "@/domain/entities/user.entity";
import { createContext } from "react";


export interface ICurrentUserContext {
    currentUser: ICurrentUser,
    setCurrentUser: (value: any) => void,
    fetchCurrentUser: (credentials: any) => Promise<void>
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
    currentUser: {
        username: "",
        fullname: "",
        userID: "",
        email: "",
        password: "",
        profilePicture: ""
    },
    setCurrentUser: () => {},
    fetchCurrentUser: async () => {}
})