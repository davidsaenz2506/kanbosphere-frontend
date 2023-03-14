import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"

export const CreateWorkSpaces = async (template: IWspUser): Promise<void> => {
    await httpService.post('/workSpaces/create', template);
    return;
  };
  