import React, { ReactNode } from "react";
import { FC } from "react";

import { CurrentWorkSpaceContext } from "./currentWsp.context";
import { IWspUser } from "@/domain/entities/userWsps.entity";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentWorkSpaceProvider: FC<PropTypes> = ({ children }: any) => {
  const [currentWorkSpace, setCurrentWorkSpace] = React.useState<IWspUser>();

  return (
    <CurrentWorkSpaceContext.Provider
      value={{
        currentWorkSpace,
        setCurrentWorkSpace,
      }}
    >
      {children}
    </CurrentWorkSpaceContext.Provider>
  );
};
