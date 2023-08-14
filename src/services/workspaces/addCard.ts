
import httpService from '../../lib/httpClient';
import {  ITransactionToDo } from '@/domain/entities/todo.entity';

export const AddCard = async (workspaceId: string | undefined, toPush: ITransactionToDo): Promise<void> => {

    await httpService.post(`/workSpaces/card/add/${workspaceId}`, toPush);
    return;

};
