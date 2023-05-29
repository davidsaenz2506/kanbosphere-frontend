import httpService from "../../lib/httpClient";
import { IQuerySpread } from "@/domain/entities/querySpread";

export const GetFilteredDataByQuery = async (
    queryObject: IQuerySpread,
    userId: string
): Promise<any> => {
    const spreadData = await httpService.post(`/spreadsheet/${userId}`, queryObject);
    return spreadData.data;
};
