import httpService from '../../lib/httpClient';

export const LoginUser = async (userCredentials: any): Promise<any> => {

  const webToken = await httpService.post(`/user`, userCredentials);  
  return webToken;
  
};
