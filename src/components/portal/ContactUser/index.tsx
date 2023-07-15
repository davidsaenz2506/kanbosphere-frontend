import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  ExternalLinkIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  ButtonGroup,
  Divider,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { GetManyUsers } from "@/services/user/getManyUsers";
import ICurrentUser from "@/domain/entities/user.entity";
import { OperateRequest } from "@/services/user/friendRequest";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";

export const ContactUser = () => {
  const { currentUser } = useCurrentUser();
  const currentContact = useCurrentContact();
  const [itemSelected, setItemSelected] = useState<string>();
  const [isSendingQuery, setIsSendingQuery] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isDeletingFriend, setIsDeletingFriend] = useState(false);
  const [relatedUsers, setRelatedUsers] = useState<ICurrentUser[] | undefined>(
    []
  );
  const [currentQuery, setCurrentQuery] = useState("");
  const [friends, setFriends] = useState(
    currentContact.currentContacts?.friends
  );
  const [requests, setRequests] = useState(
    currentContact.currentContacts?.requests
  );

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
      <div
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
              Aquí puedes encontrar y agregar contactos.
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
                      <Tooltip label="Share workspace">
                        <IconButton
                          borderRadius={"20px"}
                          colorScheme="blue"
                          aria-label="Add to friends"
                          icon={<ExternalLinkIcon />}
                        />
                      </Tooltip>

                      <Tooltip label="Eliminar">
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

                            const operateRequest = await OperateRequest(
                              result?._id,
                              {
                                canonicalId: currentUser._id,
                                method: "delete",
                              }
                            );

                            if (operateRequest) {
                              currentContact.setCurrentContacts({
                                friends:
                                  currentContact.currentContacts?.friends?.splice(
                                    index - 1,
                                    1
                                  ),
                                requests:
                                  currentContact.currentContacts?.requests,
                              });
                              setIsDeletingFriend(false);
                            }
                          }}
                        />
                      </Tooltip>
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
                            const operateRequest = await OperateRequest(
                              currentUser._id,
                              {
                                canonicalId: currentRequest?._id,
                                method: "acceptreq",
                              }
                            );

                            if (operateRequest) {
                              currentContact.setCurrentContacts({
                                friends:
                                  currentContact.currentContacts?.friends,
                                requests:
                                  currentContact.currentContacts?.requests?.splice(
                                    index - 1,
                                    1
                                  ),
                              });
                              setIsAcceptingRequest(false);
                            }
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
                            const operateRequest = await OperateRequest(
                              currentUser._id,
                              {
                                canonicalId: currentRequest?._id,
                                method: "deletereq",
                              }
                            );

                            if (operateRequest) {
                              currentContact.setCurrentContacts({
                                friends:
                                  currentContact.currentContacts?.friends,
                                requests:
                                  currentContact.currentContacts?.requests?.splice(
                                    index - 1,
                                    1
                                  ),
                              });
                              setIsDeletingRequest(false);
                            }
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
