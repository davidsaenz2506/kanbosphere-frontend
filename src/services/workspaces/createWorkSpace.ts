import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"
import { HttpResponseContract } from "@/domain/contracts/http.contract";

export const CreateWorkSpaces = async (template: Partial<IWspUser>): Promise<HttpResponseContract<IWspUser>> => {
    const response : HttpResponseContract<IWspUser> = await httpService.post('/workSpaces/create', template);
    return response;
  };
  