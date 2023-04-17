import ICurrentUser from "@/domain/entities/user.entity";
import httpService from "../../lib/httpClient"

export const GetCurrentUser = async (username: string): Promise<ICurrentUser | undefined> => {
    const currentUser: any = await httpService.post(`/user/get/${username}`);
    return currentUser.data;
};
