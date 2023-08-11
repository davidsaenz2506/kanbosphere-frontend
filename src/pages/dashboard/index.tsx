import React, { useState } from "react";
import styles from "../../styles/portal.module.css";
import "bootstrap/dist/css/bootstrap.css";

import ToolButtons from "../../components/Portal/ToolButtons";
import EndBar from "../../components/Portal/EndBar";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import Cookies from "universal-cookie";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

import jwtDecode from "jwt-decode";
import { GetCurrentUser } from "@/services/user/getCurrentUser";
import { GetUsersByArray } from "@/services/user/getByArray";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";
import {
  Box,
  IconButton,
  Text,
  Spinner,
  Avatar,
  Badge,
  Icon,
  ButtonGroup,
} from "@chakra-ui/react";
import { BellIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import currentBiridectionalCommunication from "@/services/socket";
import { renderComponent } from "@/routes";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import PopoverComponent from "@/components/Popover/General";
import IUserInvitations from "@/domain/entities/invitations";
import { getDaysPassedFromDate } from "@/utilities/date/getDays";

import { IoIosNotificationsOutline } from "react-icons/io";
import { HandleInvitation } from "@/services/user/invitations/handle";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const PortalUser = () => {
  const cookies = new Cookies();
  const router = useRouter();
  const { query } = router;
  const { userWsps, setUsersWsps } = useWorkspace();
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const computedUserItems = useCurrentUser();
  const [loadingServerData, setLoadingServerData] = useState(false);
  const { setCurrentContacts } = useCurrentContact();
  const [isTriggerActive, setIsTriggerActive] = useState(false);

  const [droppedElement, setDroppedElement] = useState<string | undefined>(
    undefined
  );

  const userPrivateToken = cookies.get("tumbleToken");
  const workSpaces = useWorkspace();

  const handleNotificationAction = async (
    index: number,
    requestData: IUserInvitations
  ): Promise<any> => {
    setDroppedElement(undefined);
    const currentNotifications: IUserInvitations[] =
      computedUserItems.currentUser.invitations;
    const newNotificationsChunk: IUserInvitations[] =
      currentNotifications.filter(
        (forgotten: any, blockIndex: number) => blockIndex !== index
      );

    computedUserItems.setCurrentUser({
      ...computedUserItems.currentUser,
      invitations: newNotificationsChunk,
    });

    if (computedUserItems.currentUser._id)
      await HandleInvitation(computedUserItems.currentUser._id, {
        ...requestData,
        method: "accept",
      });
  };

  const handleNotificationDelete = async (
    index: number,
    requestData: IUserInvitations
  ): Promise<any> => {
    setDroppedElement(undefined);
    const currentNotifications: IUserInvitations[] =
      computedUserItems.currentUser.invitations;
    const newNotificationsChunk: IUserInvitations[] =
      currentNotifications.filter(
        (forgotten: any, blockIndex: number) => blockIndex !== index
      );

    computedUserItems.setCurrentUser({
      ...computedUserItems.currentUser,
      invitations: newNotificationsChunk,
    });

    if (computedUserItems.currentUser._id)
      await HandleInvitation(computedUserItems.currentUser._id, {
        ...requestData,
        method: "delete",
      });
  };

  currentBiridectionalCommunication.emit(
    "joinToWorkspaceRoom",
    currentWorkSpace?._id
  );

  currentBiridectionalCommunication.on("currentDataUpdated", (response) => {
    if (response) {
      const currentUpdatedWorkspace: IWspUser = response[0];
      const currentUserWorkspaces: IWspUser[] = userWsps;
      const modifiedUserWorkspaces: IWspUser[] = currentUserWorkspaces.map(
        (currentBlock: IWspUser) => {
          if (currentBlock._id === currentUpdatedWorkspace._id)
            return response[0];
          return currentBlock;
        }
      );

      setCurrentWorkSpace(currentUpdatedWorkspace);
      setUsersWsps(modifiedUserWorkspaces);
    }
  });

  currentBiridectionalCommunication.on("userWorkspacesUpdated", (response) => {
    if (response) {
      setUsersWsps(response);
    }
  });

  React.useEffect(() => {
    async function getUserInfoFromServer() {
      const decodedInfoFromServer: any = jwtDecode(userPrivateToken);

      const userInfoFromDataBase = await GetCurrentUser(
        decodedInfoFromServer.username
      );

      //@ts-ignore
      const friendsData: string[] = userInfoFromDataBase?.friends.map(
        (currentCanonicalId) => currentCanonicalId.canonicalId
      );

      //@ts-ignore
      const requestData: string[] = userInfoFromDataBase?.requests.map(
        (currentCanonicalId) => currentCanonicalId.canonicalId
      );

      const dataShakeFriends = await GetUsersByArray(friendsData);
      const dataShakeRequests = await GetUsersByArray(requestData);

      const currentRequestAndFriendData = {
        friends: dataShakeFriends,
        requests: dataShakeRequests,
      };

      computedUserItems.setCurrentUser(userInfoFromDataBase);
      setCurrentContacts(currentRequestAndFriendData);
    }

    getUserInfoFromServer();
  }, []);

  React.useEffect(() => {
    if (computedUserItems.currentUser.userID) getUpdatedWorkspace();
  }, [computedUserItems.currentUser.userID]);

  async function getUpdatedWorkspace() {
    currentBiridectionalCommunication.emit(
      "joinToRoom",
      computedUserItems.currentUser._id
    );

    currentBiridectionalCommunication.on("currentUserUpdated", (response) => {
      if (response) {
        computedUserItems.setCurrentUser(response[0]);
        setCurrentContacts(response[1]);
      }
    });
  }

  React.useEffect(() => {
    if (computedUserItems.currentUser.userID)
      workSpaces.fetchWorkSpaces(
        computedUserItems.currentUser._id ?? "",
        setLoadingServerData
      );
  }, [computedUserItems.currentUser.userID]);

  return (
    <React.Fragment>
      <Box style={{ backgroundColor: "white", height: "100vh" }}>
        <nav
          id="navbarHome"
          className="navbar navbar-light bg-light"
          style={{
            background:
              "linear-gradient(90deg, rgba(33,42,62,1) 100%, rgba(33,42,62,1) 100%,  rgba(33,42,62,1) 100%)",
          }}
        >
          <a
            className="navbar-brand"
            href="#"
            style={{
              marginLeft: "20px",
              color: "white",
              fontWeight: "bolder",
            }}
          >
            Dashboard
          </a>

          <Box style={{ display: "flex" }}>
            <PopoverComponent
              placement="bottom-right"
              content={
                <Box
                  minW={"700px"}
                  maxW={"700px"}
                  padding={"15px 20px 20px 20px"}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Text fontWeight={"bold"}>Notificaciones</Text>
                    <Icon
                      w={6}
                      h={6}
                      marginLeft={"10px"}
                      transform={"rotate(10deg)"}
                      as={IoIosNotificationsOutline}
                    />
                  </Box>

                  {!computedUserItems.currentUser.invitations.length && (
                    <Text marginTop={"5px"}>
                      En este momento no tienes invitaciones para aceptar
                    </Text>
                  )}
                  {computedUserItems.currentUser.invitations.map(
                    (currentInvitation: IUserInvitations, index: number) => {
                      return (
                        <Box
                          padding={"10px 0 0 0"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          transition={
                            droppedElement !==
                            currentInvitation.workspaceToJoinId
                              ? "none"
                              : "all .5s ease-in-out"
                          }
                          transform={
                            droppedElement ===
                            currentInvitation.workspaceToJoinId
                              ? "translateX(1200px)"
                              : "none"
                          }
                        >
                          <Box display={"flex"} alignItems={"center"}>
                            <Avatar
                              marginRight={"10px"}
                              w={10}
                              h={10}
                              name={currentInvitation.hostName}
                            />
                            <Box>
                              <Box>
                                <Badge marginRight={"10px"}>Invitación</Badge>
                                {getDaysPassedFromDate(
                                  currentInvitation.requestDate
                                ) > 1 ? (
                                  <Badge colorScheme="purple">
                                    Hace{" "}
                                    {getDaysPassedFromDate(
                                      currentInvitation.requestDate
                                    )}{" "}
                                    días
                                  </Badge>
                                ) : (
                                  <Badge colorScheme="green">Hoy</Badge>
                                )}
                              </Box>

                              <Text fontSize={"15px"}>
                                Tu contacto {currentInvitation.hostName} te ha
                                invitado a unirte a su espacio de trabajo.{" "}
                              </Text>
                            </Box>
                          </Box>
                          <ButtonGroup marginLeft={"40px"} size={"xs"}>
                            <IconButton
                              colorScheme="teal"
                              aria-label="Add to friends"
                              borderRadius={"20px"}
                              icon={<CheckIcon />}
                              onClick={() => {
                                setDroppedElement(
                                  currentInvitation.workspaceToJoinId
                                );
                                setTimeout(() => {
                                  handleNotificationAction(
                                    index,
                                    currentInvitation
                                  );
                                }, 500);
                              }}
                            />

                            <IconButton
                              colorScheme="red"
                              aria-label="Add to friends"
                              borderRadius={"20px"}
                              icon={<DeleteIcon />}
                              onClick={() => {
                                setDroppedElement(
                                  currentInvitation.workspaceToJoinId
                                );
                                setTimeout(() => {
                                  handleNotificationDelete(
                                    index,
                                    currentInvitation
                                  );
                                }, 500);
                              }}
                            />
                          </ButtonGroup>
                        </Box>
                      );
                    }
                  )}
                </Box>
              }
              trigger={
                <IconButton
                  className={styles.buttonNotification}
                  marginRight={"15px"}
                  variant={"unstyled"}
                  border={"none"}
                  aria-label="notifications"
                  icon={
                    <Box style={{ position: "relative" }}>
                      <BellIcon color={"white"} w={7} h={7} />
                      {computedUserItems.currentUser.invitations?.length !==
                        0 && (
                        <Box
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {computedUserItems.currentUser.invitations?.length}
                        </Box>
                      )}
                    </Box>
                  }
                />
              }
            />

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ marginRight: "20px", color: "white" }}>
                {computedUserItems.currentUser.fullname
                  ? computedUserItems.currentUser.fullname
                  : "Obteniendo información..."}
              </p>
              <Avatar
                w={10}
                h={10}
                style={{ marginRight: "20px" }}
                name={computedUserItems.currentUser.fullname}
                icon={<Spinner />}
                src={
                  computedUserItems.currentUser.profilePicture ??
                  computedUserItems.currentUser.profilePicture
                }
              />
            </Box>
          </Box>
        </nav>
        <Box className={styles.principalContainer}>
          <Box className={styles.toolSpace}>
            <Box id="toolSpace" className={styles.toolContainer}>
              <ToolButtons setIsTriggerActive={setIsTriggerActive} />
              <EndBar setIsTriggerActive={setIsTriggerActive} />
            </Box>

            <Box id="resizerTool" className={styles.resizerParticle}></Box>
          </Box>

          <Box
            id="workSpace"
            opacity={isTriggerActive ? 0 : 1}
            transition={!isTriggerActive ? "all .2s" : "none"}
            className={styles.workSpace}
          >
            {renderComponent(query, loadingServerData)}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PortalUser;
