
import { ITransactionWorkspace } from '@/domain/entities/userWsps.entity';
import httpService from '../../lib/httpClient';
import { ITransactionData } from '@/domain/entities/todo.entity';

export const UpdateWorkSpace = async (workspaceId: string | undefined, workspaceData: ITransactionWorkspace): Promise<void> => {

  await httpService.post(`/workSpaces/update/${workspaceId}`, workspaceData);
  return;

};
