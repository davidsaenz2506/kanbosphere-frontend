import { getAllWorkSpaces } from "@/services/workspaces/getAll";
import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { WorkspaceContext } from "./wsp.context";

type PropTypes = {
  children?: ReactNode;
};

export const WspProvider: FC<PropTypes> = ({ children }: any) => {

  const [userWsps, setUsersWsps] = React.useState<any>([])

  const fetchWorkSpaces = useCallback(async () => {

    try {
      const response = await getAllWorkSpaces();
      setUsersWsps(response)
    } catch (error) {
      console.log(error)
    }
      
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        userWsps,
        setUsersWsps,
        fetchWorkSpaces
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
