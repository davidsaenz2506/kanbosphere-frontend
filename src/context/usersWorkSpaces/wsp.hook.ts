import { useContext } from 'react';
import { WorkspaceContext } from './wsp.context';

export const useWorkspace = () => {

    const wspUser = useContext(WorkspaceContext);

    return wspUser;
    
};
