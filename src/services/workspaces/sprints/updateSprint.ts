
import httpService from '../../../lib/httpClient';
import {  ITransactionSprint } from '@/domain/entities/todo.entity';

export const UpdateSprintCard = async (workspaceId: string | undefined, toUpdate: ITransactionSprint ): Promise<void> => {

    await httpService.post(`/workSpaces/sprint/update/${workspaceId}`, toUpdate);
    return;

};
