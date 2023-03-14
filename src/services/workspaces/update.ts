import { IWspUser } from '@/domain/entities/userWsps.entity';
import httpService from '../../lib/httpClient';

export const UpdateWorkSpace = async (workspace: Partial<IWspUser>): Promise<void> => {

  await httpService.post(`/workSpaces/update/${workspace._id}`, workspace);
  return;

};
