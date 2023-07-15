import ICurrentUser from "@/domain/entities/user.entity";
import httpService from "../../lib/httpClient"

export const GetManyUsers = async (username: string): Promise<ICurrentUser[] | undefined> => {
    const currentUser: any = await httpService.get(`/user/getMany/${username}`);
    return currentUser;
};
