
import httpService from '../../lib/httpClient';
import { HttpResponseContract } from '@/domain/contracts/http.contract';
import ICurrentUser from '@/domain/entities/user.entity';

export const GetUsersByArray = async (toGet: string[]): Promise<ICurrentUser[] | undefined> => {

    const currentUpdatedUser: HttpResponseContract<ICurrentUser[] | undefined> = await httpService.post(`/user/getByArray`, toGet);
    return currentUpdatedUser.data;

};
