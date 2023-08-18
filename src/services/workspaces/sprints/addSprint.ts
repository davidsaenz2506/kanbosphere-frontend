
import httpService from '../../../lib/httpClient';
import {  ITransactionSprint } from '@/domain/entities/todo.entity';

export const AddSprintCard = async (workspaceId: string | undefined, toPush: ITransactionSprint ): Promise<void> => {

    await httpService.post(`/workSpaces/sprint/add/${workspaceId}`, toPush);
    return;

};
