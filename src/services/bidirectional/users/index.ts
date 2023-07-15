
import httpService from "../../../lib/httpClient"

export interface IRoomToken {
    roomToken?: string;
    isFirstLoad?: boolean
}

export const getUpdatedUserData = async (userId: string, roomToken: IRoomToken ): Promise<any> => {

    const response: any = await httpService.post(`bidirectional/users/${userId}`, roomToken);
    const dataResponse: any = response;

    return dataResponse;

}