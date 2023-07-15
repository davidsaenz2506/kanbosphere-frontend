import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { CurrentUserContext } from "./currentUser.context";
import ICurrentUser from "@/domain/entities/user.entity";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentUserProvider: FC<PropTypes> = ({ children }: any) => {
  const [currentUser, setCurrentUser] = React.useState<ICurrentUser>({
    username: "",
    fullname: "",
    userID: "",
    email: "",
    password: "",
    profilePicture: "",
    friends: [],
    requests: [],
  });

  const fetchCurrentUser = useCallback(async (credentials: any) => {
    try {
      setCurrentUser(credentials);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        fetchCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
