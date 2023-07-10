
import httpService from '../../lib/httpClient';
import { IDataToDo } from '@/domain/entities/todo.entity';

export const AddCard = async (workspaceId: string | undefined, toPush: IDataToDo): Promise<void> => {

    await httpService.post(`/workSpaces/card/add/${workspaceId}`, toPush);
    return;

};
