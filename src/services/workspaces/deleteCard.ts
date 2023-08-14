
import httpService from '../../lib/httpClient';
import { ITransactionToDo } from '@/domain/entities/todo.entity';

export const DeleteCard = async (workspaceId: string | undefined, toDelete: ITransactionToDo): Promise<void> => {

    await httpService.post(`/workSpaces/card/delete/${workspaceId}`, toDelete);
    return;

};
