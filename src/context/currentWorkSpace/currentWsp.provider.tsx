import React, { ReactNode } from "react";
import { FC } from "react";

import { CurrentWorkSpaceContext } from "./currentWsp.context";

import {DateTime} from "luxon";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentWorkSpaceProvider: FC<PropTypes> = ({ children }: any) => {
  const [currentWorkSpace, setCurrentWorkSpace] = React.useState({
    name: "",
    prefix: "",
    createdDate: DateTime.now(),
    createdById: "",
    type: "",
    wspData: [],
  });

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
