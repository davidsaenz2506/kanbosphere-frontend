
import httpService from '../../lib/httpClient';
import { HttpResponseContract } from '@/domain/contracts/http.contract';

export const OperateRequest = async (userId?: string, toRequest?: { canonicalId?: string, method: string }): Promise<HttpResponseContract<any>> => {

    const responseData: HttpResponseContract<any> = await httpService.post(`/user/friends/${userId}`, toRequest);
    return responseData.data;

};
