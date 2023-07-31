
import IUserInvitations from '@/domain/entities/invitations';
import httpService from '../../../lib/httpClient';

export const SendInvitation = async (guestId: string, toSend: Partial<IUserInvitations>): Promise<void> => {

    await httpService.post(`/user/invitations/send/${guestId}`, toSend);
    return;

};
