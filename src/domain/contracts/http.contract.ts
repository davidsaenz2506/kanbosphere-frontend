export interface HttpResponseContract<T> {
    data?: T;
    status: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
  }
  
  export interface HttpContract {
    get<T>(path: string, headers?: object): Promise<HttpResponseContract<T>>;
    post<T>(path: string, body: object, headers?: object): Promise<HttpResponseContract<T>>;
  }
  
  export default HttpContract;
  