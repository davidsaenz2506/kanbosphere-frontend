import { IWspUser } from '@/domain/entities/userWsps.entity';
import httpService from '../../lib/httpClient';

export const DeleteCurrentWorkSpace = async (workspace: string): Promise<void> => {

  await httpService.post(`/workSpaces/delete/${workspace}`);
  return;

};
