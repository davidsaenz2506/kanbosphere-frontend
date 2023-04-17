import React, { ReactNode, useCallback } from "react";
import { FC } from "react";

import { CurrentUserContext } from "./currentUser.context";
import { LoginUser } from "@/services/user/login";

type PropTypes = {
  children?: ReactNode;
};

export const CurrentUserProvider: FC<PropTypes> = ({ children }: any) => {
  const [currentUser, setCurrentUser] = React.useState({
    username: "",
    fullname: "",
    userID: "",
    email: "",
    password: "",
    profilePicture: ""
  });

  const fetchCurrentUser = useCallback(async (credentials: any) => {
    try {
      setCurrentUser(credentials);
    } catch (error) {
      console.log(error);
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
