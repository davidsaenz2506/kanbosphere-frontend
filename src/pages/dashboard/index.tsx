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
  Button,
  List,
  ListItem,
  ListIcon,
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

import { RiArrowDownSLine } from "react-icons/ri";
import { GoContainer } from "react-icons/go";
import { BsKanban, BsUiChecksGrid } from "react-icons/bs";

function delayTime(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PortalUser = () => {
  const cookies = new Cookies();
  const router = useRouter();
  const { query } = router;
  const { userWsps } = useWorkspace();
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const computedUserItems = useCurrentUser();
  const [loadingServerData, setLoadingServerData] = useState(false);
  const { setCurrentContacts } = useCurrentContact();
  const [isTriggerActive, setIsTriggerActive] = useState(false);
  const [currentSelected, setCurrentSelected] = useState<string>("");

  const [droppedElement, setDroppedElement] = useState<string | undefined>(
    undefined
  );

  const userPrivateToken = cookies.get("tumbleToken");
  const workSpaces = useWorkspace();

  const handleNotificationAction = async (
    index: number,
    requestData: IUserInvitations
  ) => {
    setDroppedElement(undefined);
    const currentNotifications: IUserInvitations[] =
      computedUserItems.currentUser.invitations;
    const newNotificationsChunk: IUserInvitations[] =
      currentNotifications.filter(
        (forgotten: IUserInvitations, blockIndex: number) =>
          blockIndex !== index
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
  ) => {
    setDroppedElement(undefined);
    const currentNotifications: IUserInvitations[] =
      computedUserItems.currentUser.invitations;
    const newNotificationsChunk: IUserInvitations[] =
      currentNotifications.filter(
        (forgotten: IUserInvitations, blockIndex: number) =>
          blockIndex !== index
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
      setCurrentWorkSpace(currentUpdatedWorkspace);
    }
  });

  React.useEffect(() => {
    async function getUserInfoFromServer() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedInfoFromServer: any = jwtDecode(userPrivateToken);

      const userInfoFromDataBase = await GetCurrentUser(
        decodedInfoFromServer.username
      );

      const friendsData: string[] | undefined =
        userInfoFromDataBase?.friends.map(
          (currentCanonicalId) => currentCanonicalId.canonicalId
        );

      const requestData: string[] | undefined =
        userInfoFromDataBase?.requests.map(
          (currentCanonicalId) => currentCanonicalId.canonicalId
        );

      if (friendsData && requestData && userInfoFromDataBase) {
        const dataShakeFriends = await GetUsersByArray(friendsData);
        const dataShakeRequests = await GetUsersByArray(requestData);

        const currentRequestAndFriendData = {
          friends: dataShakeFriends,
          requests: dataShakeRequests,
        };

        computedUserItems.setCurrentUser(userInfoFromDataBase);
        setCurrentContacts(currentRequestAndFriendData);
      }
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
        <Box
          id="navbarHome"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          style={{
            background: "linear-gradient(90deg, rgba(33,42,62,1) 100%, rgba(33,42,62,1) 100%,  rgba(33,42,62,1) 100%)",
            height: "50px",
           
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Text
              className="navbar-brand"
              style={{
                marginLeft: "20px",
                marginRight: "50px",
                color: "white",
                fontWeight: "bolder",
                fontSize: "18px",
              }}
            >
              Dashboard
            </Text>
            <PopoverComponent
              clickAwayClosesModal={true}
              trigger={
                <Button variant={"unstyled"} padding={"5px"} size={"sm"} bgColor={"transparent"} color={"white"}>
                  Principales
                  <Icon
                    marginLeft={"10px"}
                    w={6}
                    h={6}
                    as={RiArrowDownSLine}
                    aria-label="containers"
                  />
                </Button>
              }
              content={
                <Box
                  minW={"250px"}
                  maxW={"250px"}
                  padding={"10px 20px 0px 20px"}
                  height={"max-content"}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Text fontWeight={"bold"}>Tus contenedores</Text>
                    <Icon w={5} h={5} marginLeft={"10px"} as={GoContainer} />
                  </Box>

                  <List
                    marginTop={"20px"}
                    marginLeft={"0px"}
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"flex-start"}
                  >
                    {userWsps.map((todoWorkspace, index) => (
                      <ListItem
                        key={index}
                        cursor={"pointer"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                          alignItems: "center",
                          color: "#1C1C1C",
                          marginTop: index === 0 ? "-10px" : "0px",
                          marginBottom:
                            index === userWsps.length - 1 ? "0px" : "8px",
                        }}
                      >
                        <Box display={"flex"} alignItems={"center"}>
                          <ListIcon
                            as={
                              todoWorkspace.type === "agile"
                                ? BsKanban
                                : BsUiChecksGrid
                            }
                            w={4}
                            h={4}
                            sx={{ marginRight: "10px" }}
                          />
                          <Text
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            fontSize={"15px"}
                            fontWeight={
                              currentSelected === todoWorkspace._id
                                ? "bolder"
                                : "normal"
                            }
                            onClick={async () => {
                              if (currentWorkSpace?._id === todoWorkspace._id)
                                return;
                              setIsTriggerActive(true);
                              setCurrentSelected(todoWorkspace._id);

                              router.push(
                                `/dashboard?briefcase=${todoWorkspace.type}&fridgeKey=${todoWorkspace._id}`
                              );
                              await delayTime(150);

                              setCurrentWorkSpace(undefined);
                              await delayTime(200);

                              setIsTriggerActive(false);
                            }}
                          >
                            {" "}
                            {todoWorkspace.name}
                          </Text>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              }
            />
          </Box>

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
                          key={index}
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
                  marginRight={"20px"}
                  variant={"unstyled"}
                  border={"none"}
                  aria-label="notifications"
                  icon={
                    <Box style={{ position: "relative" }}>
                      <BellIcon
                        transition={"all .2s"}
                        className={styles.buttonNotification}
                        color={"white"}
                        w={7}
                        h={7}
                      />
                      <Box
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          display: "flex",
                          backgroundColor:
                            computedUserItems.currentUser.invitations.length > 0
                              ? "red"
                              : "green",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {computedUserItems.currentUser.invitations?.length}
                      </Box>
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
              <p style={{ marginRight: "20px", color: "white", fontSize: "15px" }}>
                {computedUserItems.currentUser.fullname
                  ? computedUserItems.currentUser.fullname
                  : "Obteniendo información..."}
              </p>
              <Avatar
                w={9}
                h={9}
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
        </Box>
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
            transition={!isTriggerActive ? "all .4s" : "none"}
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
