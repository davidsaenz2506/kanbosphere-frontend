import { IWspUser } from '@/domain/entities/userWsps.entity';
import httpService from '../../lib/httpClient';

export const UpdateWorkSpace = async (workspaceId: string | undefined, workspaceData: Partial<IWspUser>): Promise<void> => {

  await httpService.post(`/workSpaces/update/${workspaceId}`, workspaceData);
  return;

};
