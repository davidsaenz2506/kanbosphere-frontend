
import httpService from '../../../lib/httpClient';
import {  ITransactionSprint } from '@/domain/entities/todo.entity';

export const DeleteSprint = async (workspaceId: string | undefined, toDelete: ITransactionSprint ): Promise<void> => {

    await httpService.post(`/workSpaces/sprint/delete/${workspaceId}`, toDelete);
    return;

};
