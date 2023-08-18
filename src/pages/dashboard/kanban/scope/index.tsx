import React, { useState } from "react";
import { useRouter } from "next/router";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import {
  Box,
  Tag,
  Button,
  Icon,
  Text,
  Divider,
  AbsoluteCenter,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FcIdea, FcOpenedFolder, FcTodoList } from "react-icons/fc";
import AddTask from "@/components/Modals/AddTask";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { IWspUser } from "@/domain/entities/userWsps.entity";

import { DateTime } from "luxon";
import { formatDate } from "@/utilities/date/format";
import ScopeCardComponent from "@/components/Scope/Card";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddSprint from "@/components/Modals/AddSprint";

import { HiOutlinePlayCircle } from "react-icons/hi2";

const getSortedByDate = (
  currentWorkSpace: IWspUser | undefined
): [string, IDataToDo[]][] | undefined => {
  const currentWorkspaceChildContainers: IDataToDo[] | undefined =
    currentWorkSpace?.container.wspData;

  if (currentWorkspaceChildContainers) {
    let sortedChildElements: object = {};

    currentWorkspaceChildContainers.forEach((currentChild: IDataToDo) => {
      if (!sortedChildElements[currentChild.createDate]) {
        sortedChildElements[currentChild.createDate] = [];
      }
      sortedChildElements[currentChild.createDate].push(currentChild);
    });

    const sortedEntries = Object.entries(sortedChildElements).sort((a, b) => {
      return (
        DateTime.fromISO(b[0]).toMillis() - DateTime.fromISO(a[0]).toMillis()
      );
    });

    return sortedEntries;
  }
};

export const ObserveScopes = () => {
  const router = useRouter();
  const { currentWorkSpace } = useCurrentWorkspace();
  const [addTask, setAddTask] = useState<boolean>(false);
  const [addSprint, setAddSprint] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSortedChildren, setCurrentSortedChildren] =
    useState<[string, IDataToDo[]][]>();
  const [indexes, setIndexes] = useState<number[]>();

  React.useEffect(() => {
    const currentSortedData: [string, IDataToDo[]][] | undefined =
      getSortedByDate(currentWorkSpace);
    if (currentSortedData) setCurrentSortedChildren(currentSortedData);
    if (currentSortedData)
      setIndexes(currentSortedData.map((_, index: number) => index));
  }, [currentWorkSpace?.container.wspData]);

  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <AddTask
          isOpen={addTask}
          onClose={setAddTask}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <AddSprint
          isOpen={addSprint}
          onClose={setAddSprint}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Box bgColor={"white"} style={{ height: "100vh" }}>
          <Box
            pl={"30px"}
            pr={"30px"}
            display={"flex"}
            justifyContent={"space-between"}
            height={"8%"}
            borderBottom={"2px solid #d9d9e3"}
            bgColor={"rgba(247,247,248,1)"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Button
                size={"sm"}
                fontSize={"20px"}
                colorScheme="teal"
                aria-label="add sprint"
                fontWeight={"normal"}
                onClick={() => {
                  const currentPath: string = router.asPath;
                  const newPath: string = currentPath.replace(
                    /\/observeScopes$/,
                    ""
                  );

                  router.replace(newPath);
                }}
              >
                <Icon marginRight={"10px"} as={IoArrowBackCircleOutline} />
                Volver al tablero
              </Button>

              <Button
                size={"sm"}
                fontSize={"20px"}
                colorScheme="purple"
                marginLeft={"15px"}
                aria-label="add sprint"
                fontWeight={"normal"}
                onClick={() => {
                  setAddTask(true);
                }}
              >
                <Icon marginRight={"10px"} as={FcIdea} />
                Añadir historia
              </Button>
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <Tag
                borderRadius="base"
                variant="subtle"
                colorScheme="green"
                size={"lg"}
                fontSize={"20px"}
              >
                <Icon marginRight={"10px"} as={FcOpenedFolder} />
                Gestor de objetivos {currentWorkSpace?.name}
              </Tag>
            </Box>
          </Box>
          <Box display={"flex"} height={"92%"}>
            <Box
              paddingLeft={"30px"}
              paddingRight={"30px"}
              marginBottom={"40px"}
              bgColor={"rgba(247,247,248,1)"}
              width={"75%"}
              overflowY={"scroll"}
              css={{
                "&::-webkit-scrollbar": {
                  width: "0px",
                },
              }}
            >
              <Box display={"flex"} alignItems={"center"} height={"8%"}>
                <Text
                  cursor={"default"}
                  display={"flex"}
                  alignItems={"center"}
                  fontSize={"20px"}
                  textAlign={"start"}
                >
                  <Icon marginRight={"10px"} as={FcTodoList} />
                  Historias de {currentWorkSpace?.name}
                </Text>
              </Box>
              <Box height={"90%"}>
                {indexes && (
                  <Accordion defaultIndex={indexes} allowMultiple>
                    {currentSortedChildren &&
                      currentSortedChildren?.map((currentMappedChildren) => {
                        return (
                          <AccordionItem border={"transparent"}>
                            <Box pb={"0"}>
                              <AccordionButton
                                _hover={{}}
                                padding={"10px 0 10px 0"}
                                position={"relative"}
                              >
                                <Divider />
                                <AbsoluteCenter
                                  axis="vertical"
                                  marginLeft={"40px"}
                                  bg="white"
                                  px="4"
                                >
                                  <Text color="#8e908c">
                                    {formatDate(
                                      DateTime.fromISO(
                                        currentMappedChildren[0]
                                      ),
                                      "DDD"
                                    ).toUpperCase()}{" "}
                                  </Text>
                                </AbsoluteCenter>

                                <AccordionIcon
                                  fontSize="30px"
                                  marginLeft={"10px"}
                                />
                              </AccordionButton>

                              <AccordionPanel>
                                <Box mt={"2"}>
                                  {currentMappedChildren[1].map(
                                    (currentTaskChildren) => {
                                      return (
                                        <ScopeCardComponent
                                          currentTaskChildren={
                                            currentTaskChildren
                                          }
                                        />
                                      );
                                    }
                                  )}
                                </Box>
                              </AccordionPanel>
                            </Box>
                          </AccordionItem>
                        );
                      })}
                  </Accordion>
                )}
              </Box>
            </Box>

            <Box
              bgColor={"rgba(230, 230, 231, 1)"}
              width={"25%"}
              height={"100%"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                height={"5%"}
              >
                <Button
                  marginTop={"10px"}
                  zIndex={100000}
                  colorScheme="teal"
                  size={"sm"}
                  onClick={() => {
                    setAddSprint(true);
                  }}
                >
                  Añadir objetivo
                </Button>
              </Box>
              <Box height={"95%"}>
                <Box paddingTop={"20px"} height={"5%"}>
                  <Box position="relative">
                    <Divider />
                    <AbsoluteCenter bgColor={"rgba(230, 230, 231, 1)"} px="3">
                      Sprints
                    </AbsoluteCenter>
                  </Box>
                </Box>

                <Box height={"95%"}>
                  {!currentWorkSpace?.container?.sprints?.length && (
                    <Text textAlign={"center"}>
                      Ahora mismo no tienes objetivos pendientes
                    </Text>
                  )}
                  {currentWorkSpace?.container?.sprints?.length && (
                    <Box marginTop={"10px"} pl={"30px"} pr={"30px"}>
                      {currentWorkSpace?.container?.sprints.map(
                        (currentSprint) => {
                          return (
                            <Box
                              cursor={"default"}
                              boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                              borderRadius={"5px"}
                              padding={"10px"}
                              display={"flex"}
                              justifyContent={"space-between"}
                              marginBottom={"10px"}
                              transition={"all .3s"}
                              bgColor={"white"}
                              zIndex={10000}
                              _hover={{
                                transform: "scale(1.03)",
                              }}
                            >
                              <Box>
                                <Text>{currentSprint.sprintPurpose}</Text>
                                <Badge
                                  colorScheme={
                                    currentSprint.isSprintActive
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {currentSprint.isSprintActive
                                    ? "Activo"
                                    : "Inactivo"}
                                </Badge>
                              </Box>

                              <Box
                                marginRight={"5px"}
                                display={"flex"}
                                alignItems={"center"}
                              >
                                <Button
                                  colorScheme="whatsapp"
                                  borderRadius={"50%"}
                                  size={""}
                                >
                                  <Icon w={8} h={8} as={HiOutlinePlayCircle} />
                                </Button>
                              </Box>
                            </Box>
                          );
                        }
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DndProvider>
    </React.Fragment>
  );
};
