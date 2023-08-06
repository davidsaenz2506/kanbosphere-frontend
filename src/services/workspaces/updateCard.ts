import httpService from '../../lib/httpClient';
import { ITransactionToDo } from '@/domain/entities/todo.entity';

export const UpdateCard = async (workspaceId: string | undefined, toUpdate: ITransactionToDo): Promise<boolean> => {

    await httpService.post(`/workSpaces/card/update/${workspaceId}`, toUpdate);
    return true;

};
