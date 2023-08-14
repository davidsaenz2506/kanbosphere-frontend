import { getAllWorkSpaces } from "@/services/workspaces/getAll";
import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { WorkspaceContext } from "./wsp.context";
import { IWspUser } from "@/domain/entities/userWsps.entity";

type PropTypes = {
  children?: ReactNode;
};

export const WspProvider: FC<PropTypes> = ({ children }) => {
  const [userWsps, setUsersWsps] = React.useState<IWspUser[]>([]);

  const fetchWorkSpaces = useCallback(
    async (
      userId: string,
      setLoadingServerData?: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      try {
        const response = await getAllWorkSpaces(userId);

        if (setLoadingServerData) setLoadingServerData(true);
        if (response) setUsersWsps(response);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

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
