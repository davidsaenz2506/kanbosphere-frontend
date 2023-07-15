
import httpService from '../../lib/httpClient';
import { HttpResponseContract } from '@/domain/contracts/http.contract';
import ICurrentUser from '@/domain/entities/user.entity';

export const UpdateUser = async (username: string, toUpdate: ICurrentUser): Promise<ICurrentUser | undefined> => {

    const currentUpdatedUser: HttpResponseContract<ICurrentUser | undefined> = await httpService.post(`/user/update/${username}`, toUpdate);
    return currentUpdatedUser.data;

};
