
import { createContext } from "react";

export interface ILoadingChunkContext {
    loadingChunk: boolean,
    setLoadingChunk: React.Dispatch<React.SetStateAction<boolean>>,
}

export const LoadingChunkContext = createContext<ILoadingChunkContext>({
    loadingChunk: false,
    setLoadingChunk: () => { }
})