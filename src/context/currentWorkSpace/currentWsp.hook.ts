import { useContext } from 'react';
import { CurrentWorkSpaceContext } from './currentWsp.context';

export const useCurrentWorkspace = () => {

    const wspUser = useContext(CurrentWorkSpaceContext);

    return wspUser;
    
};
