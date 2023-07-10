
import httpService from "../../lib/httpClient"

export const getUpdatedServerWorkspaces = async (userId: string): Promise<any> => {

    const response: any = await httpService.get(`bidirectional/${userId}`);
    const dataResponse: any = response;

    return dataResponse;

}