import HttpContract, {
  HttpResponseContract,
} from "../../../domain/contracts/http.contract";
import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export default class httpAxiosInstance implements HttpContract {
  private axiosInstance: AxiosInstance;
  private authorizationWebToken: string;

  constructor(url: string, extraHeader?: { [key: string]: string }) {
    this.authorizationWebToken = Cookies.get("tumbleToken");
    this.axiosInstance = axios.create({
      baseURL: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.authorizationWebToken}`,
        ...extraHeader,
      },
    });
  }

  public async get<T>(path: string, headers?: object): Promise<T> {
    const { data } = await this.axiosInstance
      .get<T>(path, headers)
      .catch((error) =>
        Promise.reject({
          status: error?.response?.status || -1,
          error: error?.response?.data || error?.response?.statusText || error,
        })
      );

    return data;
  }

  public async post<T>(
    path: string,
    body?: object,
    headers?: object
  ): Promise<HttpResponseContract<T>> {
    const response = await this.axiosInstance
      .post(path, body, headers)
      .catch((error) =>
        Promise.reject({
          status: error?.response?.status || -1,
          error: error?.response?.data || error?.response?.statusText || error,
        })
      );

    return response;
  }
}
