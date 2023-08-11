import { useContext } from 'react';
import { LoadingChunkContext } from './loadingChunk.context';

export const useLoadingChunk = () => {

    const chunkInformation = useContext(LoadingChunkContext);
    return chunkInformation;
    
};
