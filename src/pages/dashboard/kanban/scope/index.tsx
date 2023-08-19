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
  IconButton,
} from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  FcApproval,
  FcClock,
  FcIdea,
  FcOpenedFolder,
  FcPositiveDynamic,
  FcPuzzle,
  FcTodoList,
} from "react-icons/fc";
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

import { SlArrowUp } from "react-icons/sl";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const getCurrentSprintHeight = (shrinkVector: boolean): void => {
  const navBarDocument: HTMLElement | null = document.getElementById("navbarHome");
  const bodyDocumentData: HTMLBodyElement | null = document.querySelector("body");
  const sprintBoxDocumentData: HTMLElement | null = document.getElementById("currentSprintBox");
  const historiesBoxDocumentData: HTMLElement | null = document.getElementById("currentHistoriesBox");
  const scopesHeaderBoxDocumentData: HTMLElement | null = document.getElementById("scopesHeaderBox");

  if (
    navBarDocument &&
    bodyDocumentData &&
    sprintBoxDocumentData &&
    historiesBoxDocumentData &&
    scopesHeaderBoxDocumentData
  ) {
    let calculateSprintHeigth: number;
    historiesBoxDocumentData.style.height = shrinkVector ? "0%" : "60%";
    sprintBoxDocumentData.style.height = shrinkVector ? "100%" : "40%";
    sprintBoxDocumentData.style.transition = shrinkVector ? "all .2s" : "none";
    historiesBoxDocumentData.style.transition = shrinkVector ? "all .2s" : "none";
    calculateSprintHeigth = bodyDocumentData.getBoundingClientRect().height - navBarDocument.getBoundingClientRect().height - historiesBoxDocumentData.getBoundingClientRect().height - scopesHeaderBoxDocumentData.getBoundingClientRect().height;
    sprintBoxDocumentData.style.height = shrinkVector ? "100%" : `${calculateSprintHeigth}px`;
  }
};

export const ObserveScopes = () => {
  const router = useRouter();
  const { currentWorkSpace } = useCurrentWorkspace();
  const [addTask, setAddTask] = useState<boolean>(false);
  const [addSprint, setAddSprint] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shrinkVector, setShrinkVector] = useState<boolean>(false);
  const [currentSortedChildren, setCurrentSortedChildren] =
    useState<[string, IDataToDo[]][]>();
  const [indexes, setIndexes] = useState<number[]>();
  const isBrowser = () => typeof window !== "undefined";
  const data = [
    {
      name: "Agosto",
      hdsaenz: 6,
      laurav2612: 2,
    },
    {
      name: "Septiembre",
      hdsaenz: 3,
      laurav2612: 8,
    },
    {
      name: "Octubre",
      hdsaenz: 2,
      laurav2612: 5,
    },
    {
      name: "Noviembre",
      hdsaenz: 10,
      laurav2612: 24,
    },
  ];

  if (isBrowser()) {
    window.onresize = function onResize() {
      getCurrentSprintHeight(shrinkVector);
    };
  }

  React.useEffect(() => {
    const navBarDocument: HTMLElement | null =
      document.getElementById("navbarHome");
    const bodyDocumentData: HTMLBodyElement | null =
      document.querySelector("body");
    const sprintBoxDocumentData: HTMLElement | null =
      document.getElementById("currentSprintBox");
    const historiesBoxDocumentData: HTMLElement | null =
      document.getElementById("currentHistoriesBox");
    const scopesHeaderBoxDocumentData: HTMLElement | null =
      document.getElementById("scopesHeaderBox");

    if (
      navBarDocument &&
      bodyDocumentData &&
      sprintBoxDocumentData &&
      historiesBoxDocumentData &&
      scopesHeaderBoxDocumentData
    ) {
      sprintBoxDocumentData.style.height = `${
        bodyDocumentData.getBoundingClientRect().height -
        navBarDocument.getBoundingClientRect().height -
        historiesBoxDocumentData.getBoundingClientRect().height -
        scopesHeaderBoxDocumentData.getBoundingClientRect().height
      }px`;
    }
  }, []);

  React.useEffect(() => {
    getCurrentSprintHeight(shrinkVector);
  }, [shrinkVector]);

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
            id="scopesHeaderBox"
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
            <Box display={"flex"} flexDir={"column"} width={"75%"}>
              <Box
                id="currentHistoriesBox"
                paddingLeft={"30px"}
                paddingRight={"30px"}
                bgColor={"rgba(247,247,248,1)"}
                overflowY={"scroll"}
                height={shrinkVector ? "0%" : "60%"}
                borderBottom={"2px solid #d9d9e3"}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#D3D3D3",
                    borderRadius: "0px",
                  },
                }}
              >
                <Box
                  marginTop={"5px"}
                  display={"flex"}
                  alignItems={"center"}
                  height={"10%"}
                >
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
                              <Box>
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
                id="currentSprintBox"
                paddingLeft={"30px"}
                paddingRight={"30px"}
                paddingBottom={"30px"}
                bgColor={"rgba(247,247,248,1)"}
                overflowY={"scroll"}
                display={"flex"}
                borderBottom={"2px solid #d9d9e3"}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#D3D3D3",
                    borderRadius: "0px",
                  },
                }}
              >
                <IconButton
                  as={SlArrowUp}
                  size={"sm"}
                  borderRadius={"50%"}
                  padding={"6px"}
                  cursor={"pointer"}
                  transform={`translateY(-18px) ${
                    shrinkVector ? "rotate(180deg)" : "rotate(0)"
                  }`}
                  position={"absolute"}
                  aria-label="shrink vector"
                  colorScheme="teal"
                  onClick={() => {
                    setShrinkVector(!shrinkVector);
                  }}
                />

                <Box
                  paddingTop={"30px"}
                  display={"flex"}
                  flexDir={"column"}
                  width={"50%"}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Tag
                      cursor={"default"}
                      display={"flex"}
                      alignItems={"center"}
                      fontSize={"20px"}
                      textAlign={"start"}
                      colorScheme="messenger"
                      padding={"10px"}
                      width={"100%"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                    >
                      <Icon w={7} h={7} marginRight={"10px"} as={FcApproval} />
                      Objetivo actual:{" "}
                      <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                        Maquetación
                      </span>
                    </Tag>
                  </Box>
                  <Box display={"flex"} flexDir={"column"}>
                    <Box
                      marginTop={"20px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      <Tag
                        boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                        cursor={"default"}
                        display={"flex"}
                        flexDir={"column"}
                        fontSize={"12px"}
                        textAlign={"start"}
                        colorScheme="messenger"
                        padding={"10px"}
                        width={"100%"}
                      >
                        Hay muchas variaciones de los pasajes de Lorem Ipsum
                        disponibles, pero la mayoría sufrió alteraciones en
                        alguna manera, ya sea porque se le agregó humor, o
                        palabras aleatorias que no parecen ni un poco creíbles.
                        Si vas a utilizar un pasaje de Lorem Ipsum, necesitás
                        estar seguro de que no hay nada avergonzante escondido
                        en el medio del texto. Todos los generadores de Lorem
                        Ipsum que se encuentran en Internet tienden a repetir
                        trozos predefinidos cuando sea necesario.
                      </Tag>
                    </Box>
                  </Box>

                  <Box
                    marginTop={"20px"}
                    display={"flex"}
                    justifyContent={"start"}
                  >
                    <Tag
                      cursor={"default"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      alignItems={"center"}
                      textAlign={"start"}
                      colorScheme="green"
                      padding={"10px"}
                      width={"50%"}
                    >
                      Objetivo activo
                    </Tag>
                    <Tag
                      cursor={"default"}
                      marginLeft={"20px"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      alignItems={"center"}
                      textAlign={"start"}
                      colorScheme="facebook"
                      padding={"10px"}
                      width={"50%"}
                    >
                      En proceso
                    </Tag>
                  </Box>
                </Box>
                <Box
                  paddingTop={"30px"}
                  marginLeft={"20px"}
                  display={"flex"}
                  flexDir={"column"}
                  width={"50%"}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Tag
                      cursor={"default"}
                      display={"flex"}
                      alignItems={"center"}
                      fontSize={"20px"}
                      textAlign={"start"}
                      colorScheme="messenger"
                      padding={"10px"}
                      width={"100%"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                    >
                      <Icon w={7} h={7} marginRight={"10px"} as={FcPuzzle} />
                      Estadísticas
                    </Tag>
                  </Box>

                  <Box
                    marginTop={"20px"}
                    display={"flex"}
                    justifyContent={"start"}
                    marginBottom={"20px"}
                  >
                    <Tag
                      cursor={"default"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      alignItems={"center"}
                      textAlign={"start"}
                      colorScheme="cyan"
                      padding={"10px"}
                      width={"50%"}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Icon w={5} h={5} marginRight={"10px"} as={FcClock} />
                      Horas completadas: 38
                    </Tag>
                    <Tag
                      cursor={"default"}
                      marginLeft={"20px"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      alignItems={"center"}
                      textAlign={"start"}
                      colorScheme="cyan"
                      padding={"10px"}
                      width={"50%"}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Icon
                        w={5}
                        h={5}
                        marginRight={"10px"}
                        as={FcPositiveDynamic}
                      />
                      Finalizadas: 12
                    </Tag>
                  </Box>

                  <Box
                    marginTop={"0px"}
                    display={"flex"}
                    justifyContent={"start"}
                  >
                    <Box
                      cursor={"default"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      flexDir={"row"}
                      overflowY={"hidden"}
                      bgColor={"facebook.700"}
                      width={"50%"}
                      padding={0}
                      borderRadius={"5px"}
                    >
                      <Box
                        paddingLeft={"10px"}
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"start"}
                        justifyContent={"center"}
                        width={"50%"}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Text color={"white"} fontSize={"xl"}>
                          Desde
                        </Text>

                        <Box marginTop={"-10px"} display={"flex"}>
                          <Text
                            fontSize={"xl"}
                            fontWeight={"bold"}
                            color={"white"}
                            marginRight={"20px"}
                          >
                            Agosto
                          </Text>
                        </Box>
                      </Box>

                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"50%"}
                        bgColor={"orange.500"}
                      >
                        <Text
                          fontWeight={"bold"}
                          color={"white"}
                          fontSize={"50px"}
                        >
                          22
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      cursor={"default"}
                      boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"}
                      display={"flex"}
                      flexDir={"row"}
                      overflowY={"hidden"}
                      bgColor={"facebook.700"}
                      width={"50%"}
                      marginLeft={"20px"}
                      padding={0}
                      borderRadius={"5px"}
                    >
                      <Box
                        paddingLeft={"10px"}
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"start"}
                        justifyContent={"center"}
                        width={"50%"}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Text color={"white"} fontSize={"xl"}>
                          Hasta
                        </Text>

                        <Box marginTop={"-10px"} display={"flex"}>
                          <Text
                            fontSize={"xl"}
                            fontWeight={"bold"}
                            color={"white"}
                            marginRight={"20px"}
                          >
                            Septiembre
                          </Text>
                        </Box>
                      </Box>

                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"50%"}
                        bgColor={"orange.500"}
                      >
                        <Text
                          fontWeight={"bold"}
                          color={"white"}
                          fontSize={"50px"}
                        >
                          30
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="hdsaenz"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="laurav2612"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer> */}
                </Box>
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
