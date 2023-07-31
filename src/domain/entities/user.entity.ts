import IUserInvitations from "./invitations";

export interface IFriendsRequest {
    canonicalId: string;
    requestDate: Date;
}

export interface IFriends {
    canonicalId: string
}
export default interface ICurrentUser {
    _id?: string;
    username: string;
    fullname: string;
    email: string;
    userID: string;
    password: string;
    profilePicture?: string;
    friends: IFriends[];
    requests: IFriendsRequest[];
    invitations: IUserInvitations[];
}