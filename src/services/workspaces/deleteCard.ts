
import httpService from '../../lib/httpClient';
import { IDataToDo } from '@/domain/entities/todo.entity';

export const DeleteCard = async (workspaceId: string | undefined, toDelete: Partial<IDataToDo>): Promise<void> => {

    await httpService.post(`/workSpaces/card/delete/${workspaceId}`, toDelete);
    return;

};
