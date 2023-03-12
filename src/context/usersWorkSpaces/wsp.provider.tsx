import React, { ReactNode } from "react";
import { FC } from "react";

import { WorkspaceContext } from "./wsp.context";

type PropTypes = {
  children?: ReactNode;
};

export const WspProvider: FC<PropTypes> = ({ children }: any) => {

  const [userWsps, setUsersWsps] = React.useState([])

  return (
    <WorkspaceContext.Provider
      value={{
        userWsps,
        setUsersWsps,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
