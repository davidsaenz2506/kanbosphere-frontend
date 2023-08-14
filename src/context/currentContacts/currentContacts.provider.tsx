import React, { ReactNode } from "react";
import { FC } from "react";

import { CurrentContactContext, ICurrentContact } from "./currentContacts.context";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentContactProvider: FC<PropTypes> = ({ children }) => {
  const [currentContacts, setCurrentContacts] = React.useState<ICurrentContact>({
    friends: undefined,
    requests: undefined
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
