import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"

export const getWorkspaceById = async (id: string) : Promise<IWspUser | undefined> => {

    const response : IWspUser = await httpService.get(`workSpaces/getOne/${id}`);
    const dataResponse : IWspUser = response;
 
    return dataResponse;

}