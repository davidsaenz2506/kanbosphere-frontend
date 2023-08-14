
import ICurrentUser from "@/domain/entities/user.entity";
import { createContext } from "react";


export interface ICurrentUserContext {
    currentUser: ICurrentUser,
    setCurrentUser: (value: ICurrentUser) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchCurrentUser: (credentials: any) => Promise<void>
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
    currentUser: {
        username: "",
        fullname: "",
        userID: "",
        email: "",
        password: "",
        profilePicture: "",
        friends: [],
        requests: [],
        invitations: []
    },
    setCurrentUser: () => { },
    fetchCurrentUser: async () => { }
})