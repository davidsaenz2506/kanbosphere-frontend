
import httpService from "../../../lib/httpClient"
import { IRoomToken } from "../users";

export const getUpdatedServerWorkspaces = async (userId: string, roomToken?: IRoomToken): Promise<any> => {

    const response: any = await httpService.post(`bidirectional/workspaces/${userId}`, roomToken);
    const dataResponse: any = response;

    return dataResponse;

}