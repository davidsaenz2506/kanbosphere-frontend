export default interface IUserInvitations {
    hostId: string;
    hostName: string;
    workspaceToJoinId: string;
    workspaceToJoinType: string;
    workspaceUsersAmount: number;
    workspaceToJoin: string;
    requestDate: Date;
    method?: string;
  }