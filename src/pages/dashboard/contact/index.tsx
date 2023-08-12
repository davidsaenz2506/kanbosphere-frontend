import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  EmailIcon,
  ExternalLinkIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { GetManyUsers } from "@/services/user/getManyUsers";
import ICurrentUser from "@/domain/entities/user.entity";
import { OperateRequest } from "@/services/user/friendRequest";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { SendInvitation } from "@/services/user/invitations/send";
import IUserInvitations from "@/domain/entities/invitations";
import { GetUsersByArray } from "@/services/user/getByArray";

import styles from "../../../styles/portal.module.css";

export const ContactUser = () => {
  const { currentUser } = useCurrentUser();
  const currentContact = useCurrentContact();
  const workspaces = useWorkspace();
  const [itemSelected, setItemSelected] = useState<string>();
  const [isSendingQuery, setIsSendingQuery] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const [workspaceSelected, setWorkspaceSelected] = useState<string>();
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isSendingInvitation, setIsSendingInvitation] = useState(false);
  const [isDeletingFriend, setIsDeletingFriend] = useState(false);
  const [workspacesToShare, setWorkspacesToShare] = useState(workspaces.userWsps);
  const [relatedUsers, setRelatedUsers] = useState<ICurrentUser[] | undefined>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [friends, setFriends] = useState(currentContact.currentContacts?.friends);
  const [requests, setRequests] = useState(currentContact.currentContacts?.requests);

  const { isOpen, onToggle, onClose } = useDisclosure();

  async function getUserQueries() {
    try {
      setIsSendingQuery(true);
      const resultUsers = await GetManyUsers(currentQuery);
      setRelatedUsers(resultUsers);
      setIsSendingQuery(false);
    } catch (error) {
      setIsSendingQuery(false);
    }
  }

  React.useEffect(() => {
    setFriends(currentContact.currentContacts?.friends);
    setRequests(currentContact.currentContacts?.requests);
  }, [currentUser]);

  return (
    <React.Fragment>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent
          color="black"
          bg="white"
          borderColor="blue.800"
          overflowY={"scroll"}
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#D3D3D3",
              borderRadius: "4px",
            },
          }}
          maxHeight={"500px"}
        >
          <ModalHeader marginBottom={"-5px"} fontWeight="bold" border="0">
            Invitar a trabajar
          </ModalHeader>
          <ModalCloseButton marginTop={"6px"} onClick={onClose} />
          <ModalBody>
            {!workspacesToShare.length && (
              <Text
                marginTop={"-10px"}
                borderTop={"2px solid black"}
                marginBottom={"10px"}
                padding={"10px 0 0 0"}
              >
                En este momento no se pueden compartir espacios
              </Text>
            )}

            {workspacesToShare.map((currentSpace: IWspUser, index: number) => {
              return (
                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  borderTop={"2px solid black"}
                  padding={"5px 0 10px 0"}
                >
                  <Box>
                    <Text>
                      <span style={{ fontWeight: "bold" }}>Nombre:</span>{" "}
                      {currentSpace.name}
                    </Text>
                    <Text>
                      <span style={{ fontWeight: "bold" }}>Tipo:</span>{" "}
                      {currentSpace.type}
                    </Text>

                    <Text>
                      <span style={{ fontWeight: "bold" }}>Id:</span>{" "}
                      {currentSpace._id}
                    </Text>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Button
                      leftIcon={
                        isSendingInvitation &&
                        workspaceSelected === currentSpace._id ? (
                          <Spinner size={"sm"} />
                        ) : (
                          <EmailIcon />
                        )
                      }
                      colorScheme="teal"
                      variant="solid"
                      marginRight={"10px"}
                      onClick={async () => {
                        setWorkspaceSelected(currentSpace._id);
                        setIsSendingInvitation(true);
                        const toSend: Partial<IUserInvitations> = {
                          hostId: currentUser._id,
                          hostName: currentUser.username,
                          workspaceToJoinId: currentSpace._id,
                          workspaceToJoinType: currentSpace.type,
                          workspaceUsersAmount:
                            currentSpace.collaborators.length + 1,
                          workspaceToJoin: currentSpace.name,
                        };

                        if (itemSelected) {
                          await SendInvitation(itemSelected, toSend);

                          if (
                            currentContact.currentContacts?.friends !== null
                          ) {
                            const existentObjectInFriends =
                              currentContact.currentContacts?.friends.find(
                                (object) => object?._id === itemSelected
                              );
                            const dataShakeFriend = await GetUsersByArray([
                              itemSelected,
                            ]);

                            if (existentObjectInFriends) {
                              let index =
                                currentContact.currentContacts?.friends.indexOf(
                                  existentObjectInFriends
                                );
                              //@ts-ignore
                              currentContact.currentContacts.friends[index] = dataShakeFriend[0];

                              const currentRequestAndFriendData = {
                                friends:
                                  currentContact.currentContacts?.friends,
                                requests:
                                  currentContact.currentContacts?.requests,
                              };

                              currentContact.setCurrentContacts(
                                currentRequestAndFriendData
                              );
                            }
                          }

                          workspacesToShare.splice(index, 1);
                          setWorkspacesToShare(workspacesToShare);
                        }

                        setIsSendingInvitation(false);
                      }}
                    >
                      Enviar invitación
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
      <div
        className={styles.contactSection}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "initial",
          alignItems: "start",
        }}
      >
        <Box
          width={"70%"}
          padding={"20px"}
          display={"flex"}
          flexDirection={"column"}
          height={"100vh"}
        >
          <Box>
            <Text
              textAlign={"center"}
              marginBottom={"15px"}
              fontSize={"30px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              Aquí puedes encontrar y agregar contactos
            </Text>
            <Box position="relative">
              <InputGroup>
                <InputLeftElement>
                  {isSendingQuery ? (
                    <Spinner size="sm" color="blue.500" speed="0.65s" />
                  ) : (
                    <Search2Icon />
                  )}
                </InputLeftElement>

                <Input
                  sx={{ backgroundColor: "white", width: "100%" }}
                  type="text"
                  placeholder="Buscar contactos"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.currentTarget.value === "") {
                      setRelatedUsers([]);
                      setCurrentQuery("");
                      return;
                    }

                    setCurrentQuery(e.currentTarget.value);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.code === "Backspace") {
                      setRelatedUsers([]);
                      setCurrentQuery("");
                      return;
                    }

                    if (e.code === "Enter") {
                      getUserQueries();
                    }
                  }}
                />
              </InputGroup>

              {relatedUsers?.length !== 0 && (
                <Box
                  position="absolute"
                  width={"100%"}
                  borderRadius="md"
                  zIndex={10}
                >
                  <List
                    backgroundColor={"white"}
                    minHeight={"100px"}
                    borderRadius={"5px"}
                    mt={0}
                    marginLeft={"10px"}
                  >
                    {relatedUsers?.map((result, index) => (
                      <ListItem
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        key={index}
                      >
                        <Divider marginBottom={"10px"} />
                        <Box
                          marginTop={"5px"}
                          marginBottom={
                            index === relatedUsers.length - 1 ? "15px" : "10px"
                          }
                          display={"flex"}
                          width={"100%"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Box display={"flex"} alignItems={"center"}>
                            <Box
                              display={"flex"}
                              flexDirection={"column"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              width={"100px"}
                              marginRight={"30px"}
                              marginLeft={"20px"}
                            >
                              <Avatar
                                width={35}
                                height={35}
                                src={result.profilePicture}
                              />
                              <Text
                                marginTop={"5px"}
                                fontWeight={"bold"}
                                fontSize={"15px"}
                              >
                                {result.username}
                              </Text>
                            </Box>

                            <Box>
                              <Text>{result.fullname}</Text>
                              <Text>{result.email}</Text>
                            </Box>
                          </Box>

                          <ButtonGroup
                            paddingRight={"40px"}
                            size="sm"
                            isAttached
                            variant="outline"
                          >
                            <Tooltip label="Agregar a contactos">
                              <IconButton
                                colorScheme="teal"
                                variant="solid"
                                aria-label="Add to friends"
                                icon={
                                  isSendingRequest &&
                                  itemSelected === result._id ? (
                                    <Spinner size={"sm"} />
                                  ) : (
                                    <AddIcon />
                                  )
                                }
                                onClick={async () => {
                                  setItemSelected(result._id);
                                  setIsSendingRequest(true);
                                  await OperateRequest(result._id, {
                                    canonicalId: currentUser._id,
                                    method: "sendreq",
                                  });

                                  setRelatedUsers([]);
                                  setIsSendingRequest(false);
                                }}
                              />
                            </Tooltip>
                          </ButtonGroup>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"start"}
            alignItems={"center"}
            marginTop={"20px"}
            height={"100vh"}
          >
            <Text fontSize={"30px"}>
              Total de contactos: {currentUser.friends.length}{" "}
            </Text>
            {!friends?.length && (
              <Text>
                Por ahora no tienes contactos, pero puedes explorar en el
                buscador
              </Text>
            )}

            <List
              backgroundColor={"#f5f5f5"}
              height={"70vh"}
              boxShadow={"0 2px 5px rgba(0, 0, 0, 0.2);"}
              mt={6}
              width={"100%"}
              marginLeft={"10px"}
              padding={"10px"}
            >
              {friends?.map((result, index) => (
                <ListItem
                  display={"flex"}
                  backgroundColor={"white"}
                  boxShadow={"0 2px 5px rgba(0, 0, 0, 0.2);"}
                  padding={"10px"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  key={index}
                >
                  <Box
                    marginTop={"5px"}
                    display={"flex"}
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"100px"}
                        marginRight={"30px"}
                        marginLeft={"20px"}
                      >
                        <Avatar
                          width={35}
                          height={35}
                          marginTop={"5px"}
                          src={result?.profilePicture}
                        />
                        <Text
                          marginTop={"5px"}
                          fontWeight={"bold"}
                          fontSize={"15px"}
                        >
                          {result?.username}
                        </Text>
                      </Box>

                      <Box>
                        <Text>{result?.fullname}</Text>
                        <Text marginBottom={"5px"}>{result?.email}</Text>
                      </Box>
                    </Box>

                    <ButtonGroup
                      paddingRight={"40px"}
                      size={"md"}
                      variant={"solid"}
                    >
                      <IconButton
                        borderRadius={"20px"}
                        colorScheme="blue"
                        aria-label="Share workspace"
                        icon={<ExternalLinkIcon />}
                        onClick={() => {
                          const currentInvitationIds = result?.invitations?.map(
                            (currentInv) => currentInv.workspaceToJoinId
                          );

                          setWorkspacesToShare(
                            workspaces.userWsps.filter(
                              (currentWsp: IWspUser) =>
                                // @ts-ignore
                                !currentInvitationIds?.includes(currentWsp._id)
                            )
                          );

                          setItemSelected(result?._id);
                          onToggle();
                        }}
                      />

                      <IconButton
                        colorScheme="red"
                        borderRadius={"20px"}
                        aria-label="Add to friends"
                        disabled={isDeletingFriend}
                        icon={
                          isDeletingFriend && itemSelected === result?._id ? (
                            <Spinner size={"sm"} />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        onClick={async () => {
                          setIsDeletingFriend(true);
                          setItemSelected(result?._id);

                          await OperateRequest(result?._id, {
                            canonicalId: currentUser._id,
                            method: "delete",
                          });

                          currentContact.setCurrentContacts({
                            friends:
                              currentContact.currentContacts?.friends?.splice(
                                index,
                                1
                              ),
                            requests: currentContact.currentContacts?.requests,
                          });
                          setIsDeletingFriend(false);
                        }}
                      />
                    </ButtonGroup>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        <Box
          width={"30%"}
          minWidth={"400px"}
          padding={"20px"}
          backgroundColor={"white"}
          height={"100%"}
          borderLeft={"2px solid #d3d3d3"}
        >
          <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <Text fontSize={"20px"} textAlign={"center"}>
              Solicitudes de contacto
            </Text>
            {requests?.length ? (
              <React.Fragment>
                <Text fontSize={"15px"} textAlign={"center"}>
                  En este momento tienes {currentUser.requests.length}{" "}
                  solicitudes de contacto
                </Text>
              </React.Fragment>
            ) : (
              <Text fontSize={"15px"} textAlign={"center"}>
                En este momento no tienes solicitudes de contacto
              </Text>
            )}
            <Divider marginTop={"15px"} marginBottom={"10px"} />
            <Box>
              {requests?.map((currentRequest, index) => {
                return (
                  <Box
                    display={"flex"}
                    margin={"15px"}
                    padding={"8px"}
                    backgroundColor={"rgba(247, 247, 248, 0.5);"}
                    boxShadow={"0 2px 5px rgba(0, 0, 0, 0.2);"}
                    borderRadius={"2px"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Avatar
                          width={8}
                          height={8}
                          marginLeft={"10px"}
                          src={currentRequest?.profilePicture}
                        />
                      </Box>

                      <Box>
                        <Text
                          marginLeft={"15px"}
                          fontSize={"sm"}
                          fontWeight={"bolder"}
                        >
                          {currentRequest?.username}
                        </Text>
                      </Box>
                    </Box>

                    <ButtonGroup
                      paddingRight={"10px"}
                      size="sm"
                      variant="outline"
                    >
                      <Tooltip label="Aceptar solicitud">
                        <IconButton
                          colorScheme="teal"
                          aria-label="Add to friends"
                          isDisabled={isDeletingRequest || isAcceptingRequest}
                          borderRadius={"20px"}
                          icon={
                            isAcceptingRequest &&
                            itemSelected === currentRequest?._id ? (
                              <Spinner size={"sm"} />
                            ) : (
                              <CheckIcon />
                            )
                          }
                          onClick={async () => {
                            setIsAcceptingRequest(true);
                            setItemSelected(currentRequest?._id);
                            await OperateRequest(currentUser._id, {
                              canonicalId: currentRequest?._id,
                              method: "acceptreq",
                            });

                            currentContact.setCurrentContacts({
                              friends: currentContact.currentContacts?.friends,
                              requests:
                                currentContact.currentContacts?.requests?.splice(
                                  index - 1,
                                  1
                                ),
                            });
                            setIsAcceptingRequest(false);
                          }}
                        />
                      </Tooltip>

                      <Tooltip label="Eliminar solicitud">
                        <IconButton
                          colorScheme="red"
                          aria-label="Add to friends"
                          borderRadius={"20px"}
                          isDisabled={isDeletingRequest || isAcceptingRequest}
                          icon={
                            isDeletingRequest &&
                            itemSelected === currentRequest?._id ? (
                              <Spinner size={"sm"} />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                          onClick={async () => {
                            setIsDeletingRequest(true);
                            setItemSelected(currentRequest?._id);
                            await OperateRequest(currentUser._id, {
                              canonicalId: currentRequest?._id,
                              method: "deletereq",
                            });

                            currentContact.setCurrentContacts({
                              friends: currentContact.currentContacts?.friends,
                              requests:
                                currentContact.currentContacts?.requests?.splice(
                                  index - 1,
                                  1
                                ),
                            });
                            setIsDeletingRequest(false);
                          }}
                        />
                      </Tooltip>
                    </ButtonGroup>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </div>
    </React.Fragment>
  );
};
