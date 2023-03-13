import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"

export const getAllWorkSpaces = async () : Promise<IWspUser[] | undefined> => {

    const response : IWspUser[] = await httpService.get('/workSpaces');
    const dataResponse : IWspUser[] = response ?? [];
    return dataResponse;

}