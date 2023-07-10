import httpService from '../../lib/httpClient';
import { IDataToDo } from '@/domain/entities/todo.entity';

export const UpdateCard = async (workspaceId: string | undefined, toUpdate: IDataToDo): Promise<boolean> => {

    await httpService.post(`/workSpaces/card/update/${workspaceId}`, toUpdate);
    return true;

};
