import { getAllWorkSpaces } from "@/services/workspaces/getAll";
import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { WorkspaceContext } from "./wsp.context";
import { useCurrentUser } from "../currentUser/currentUser.hook";

type PropTypes = {
  children?: ReactNode;
};

export const WspProvider: FC<PropTypes> = ({ children }: any) => {
  const [userWsps, setUsersWsps] = React.useState<any>([]);
  const computedUserDataField = useCurrentUser();

  const fetchWorkSpaces = useCallback(async (userId: string) => {
    try {
      const response = await getAllWorkSpaces(userId);
      setUsersWsps(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        userWsps,
        setUsersWsps,
        fetchWorkSpaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
