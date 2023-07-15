import { useContext } from 'react';
import { CurrentContactContext } from './currentContacts.context';

export const useCurrentContact = () => {

    const currentContact = useContext(CurrentContactContext);

    return currentContact;

};
