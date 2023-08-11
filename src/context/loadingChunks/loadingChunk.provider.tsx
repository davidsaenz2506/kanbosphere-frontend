import React, { ReactNode } from "react";
import { FC } from "react";

import { LoadingChunkContext } from "./loadingChunk.context";

type PropTypes = {
  children?: ReactNode;
};

export const LoadingChunkProvider: FC<PropTypes> = ({ children }: any) => {
  const [loadingChunk, setLoadingChunk] = React.useState<boolean>(false);

  return (
    <LoadingChunkContext.Provider
      value={{
        loadingChunk,
        setLoadingChunk,
      }}
    >
      {children}
    </LoadingChunkContext.Provider>
  );
};
