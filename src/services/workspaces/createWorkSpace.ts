import { IWspUser } from "@/domain/entities/userWsps.entity";
import httpService from "../../lib/httpClient"
import { HttpResponseContract } from "@/domain/contracts/http.contract";

export const CreateWorkSpaces = async (template: IWspUser): Promise<HttpResponseContract<unknown>> => {
    const response : HttpResponseContract<unknown> = await httpService.post('/workSpaces/create', template);
    return response;
  };
  