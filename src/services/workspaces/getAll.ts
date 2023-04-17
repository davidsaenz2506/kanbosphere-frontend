import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"

export const getAllWorkSpaces = async (userId: string) : Promise<IWspUser[] | undefined> => {

    const response : IWspUser[] = await httpService.get(`workSpaces/getPrivate/${userId}`);
    const dataResponse : IWspUser[] = response ?? [];
 
    return dataResponse;

}