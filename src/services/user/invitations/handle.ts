
import IUserInvitations from '@/domain/entities/invitations';
import httpService from '../../../lib/httpClient';

export const HandleInvitation = async (guestId: string, toSend: Partial<IUserInvitations>): Promise<void> => {

    await httpService.post(`/user/invitations/handle/${guestId}`, toSend);
    return;

};