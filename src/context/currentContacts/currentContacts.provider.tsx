import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { CurrentContactContext, ICurrentContact } from "./currentContacts.context";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentContactProvider: FC<PropTypes> = ({ children }: any) => {
  const [currentContacts, setCurrentContacts] = React.useState<ICurrentContact>({
    friends: null,
    requests: null
  });

  return (
    <CurrentContactContext.Provider
      value={{
         currentContacts,
         setCurrentContacts
      }}
    >
      {children}
    </CurrentContactContext.Provider>
  );
};
