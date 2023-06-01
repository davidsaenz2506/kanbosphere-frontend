import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";

import { Skeleton, Stack } from "@chakra-ui/react";

import styles from "../main.module.css";
import { Avatar } from "@chakra-ui/react";

const UserComponent = () => {
  const { currentUser }: ICurrentUserContext = useCurrentUser();
  const wspUser = useWorkspace();
  return (
    <div className={styles.currentUserSection}>
      <div className={styles.userCard}>
        <div className={styles.currentUser}>
          <h3 style={{ fontWeight: "bold" }}>User card</h3>

          {!currentUser.fullname ? (
            <Stack
              style={{ width: "90%", marginTop: "10px", marginBottom: "10px" }}
            >
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            <>
              {" "}
              <p style={{ fontSize: "30px" }}>{currentUser.fullname}</p>
              <p>Correo electronico: {currentUser.email}</p>
              <p>ID: {currentUser.userID} </p>
              <p style={{ marginTop: "20px" }}>
                Total de workspaces: {wspUser.userWsps.length}
              </p>
            </>
          )}
        </div>
        <div className={styles.userImage}>
          <Avatar
            className={styles.userImage}
            height={200}
            width={200}
            src={currentUser.profilePicture}
          />

          <p
            style={{
              fontSize: "40px",
              marginTop: "10px",
            }}
          >
            {currentUser.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
