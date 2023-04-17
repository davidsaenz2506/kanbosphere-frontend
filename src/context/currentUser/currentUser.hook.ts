import { useContext } from 'react';
import { CurrentUserContext } from './currentUser.context';

export const useCurrentUser = () => {

    const currentUser = useContext(CurrentUserContext);

    return currentUser;

};
