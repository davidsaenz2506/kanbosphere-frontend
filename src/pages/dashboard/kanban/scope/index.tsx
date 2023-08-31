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
import { IoArrowBackCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import {
  FcApproval,
  FcClock,
  FcOpenedFolder,
  FcPositiveDynamic,
  FcPuzzle,
} from "react-icons/fc";
import AddTask from "@/components/Modals/AddTask";
import { IClockTime, IDataToDo } from "@/domain/entities/todo.entity";
import { ISprintsData, IWspUser } from "@/domain/entities/userWsps.entity";

import { DateTime } from "luxon";
import { formatDate } from "@/utilities/date/format";
import ScopeCardComponent from "@/components/Scope/Card";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  AreaChart,
  Area,
} from "recharts";
import UpdateSprint from "@/components/Modals/UpdateSprint";
import AddSprint from "@/components/Modals/AddSprint";

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
  const navBarDocument: HTMLElement | null =
    document.getElementById("navbarHome");
  const bodyDocumentData: HTMLBodyElement | null =
    document.querySelector("body");
  const sprintBoxDocumentData: HTMLElement | null =
    document.getElementById("currentSprintBox");
  const historiesBoxDocumentData: HTMLElement | null = document.getElementById(
    "currentHistoriesBox"
  );
  const scopesHeaderBoxDocumentData: HTMLElement | null =
    document.getElementById("scopesHeaderBox");

  if (
    navBarDocument &&
    bodyDocumentData &&
    sprintBoxDocumentData &&
    historiesBoxDocumentData &&
    scopesHeaderBoxDocumentData
  ) {
    let calculateSprintHeigth: number;
    historiesBoxDocumentData.style.height = shrinkVector ? "0%" : "65%";
    sprintBoxDocumentData.style.height = shrinkVector ? "100%" : "35%";
    sprintBoxDocumentData.style.transition = shrinkVector ? "all .2s" : "none";
    historiesBoxDocumentData.style.transition = shrinkVector
      ? "all .2s"
      : "none";
    calculateSprintHeigth =
      bodyDocumentData.getBoundingClientRect().height -
      navBarDocument.getBoundingClientRect().height -
      historiesBoxDocumentData.getBoundingClientRect().height -
      scopesHeaderBoxDocumentData.getBoundingClientRect().height;
    sprintBoxDocumentData.style.height = shrinkVector
      ? `${
          bodyDocumentData.getBoundingClientRect().height -
          navBarDocument.getBoundingClientRect().height -
          scopesHeaderBoxDocumentData.getBoundingClientRect().height
        }px`
      : `${calculateSprintHeigth}px`;
  }
};

export const ObserveScopes = () => {
  const router = useRouter();
  const { currentWorkSpace } = useCurrentWorkspace();
  const [addTask, setAddTask] = useState<boolean>(false);
  const [openSprintModal, setOpenSprintModal] = useState<boolean>(false);
  const [selectedSprint, setSelectedSprint] = useState<string>();
  const [openEditSprintModal, setOpenEditSprintModal] =
    useState<boolean>(false);
  const [currentSprintActive, setCurrentSprintActive] =
    useState<ISprintsData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shrinkVector, setShrinkVector] = useState<boolean>(false);
  const [currentSortedChildren, setCurrentSortedChildren] =
    useState<[string, IDataToDo[]][]>();
  const [currentWorkingHours, setCurrentWorkingHours] = useState<number>(0);
  const [currentFinishedTasks, setCurrentFinishedTasks] = useState<number>(0);
  const [currentSprintHoursStats, setCurrentSprintHoursStats] = useState<any>();
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

  React.useEffect(() => {
    const currentActiveSprint: ISprintsData | undefined =
      currentWorkSpace?.container.sprints?.find(
        (currentSprint) => currentSprint.isSprintActive
      );

    if (currentActiveSprint && currentWorkSpace?.container.wspData) {
      setCurrentSprintActive(currentActiveSprint);
      const currentSprintTasks: IDataToDo[] =
        currentWorkSpace?.container?.wspData.filter((currentTask) =>
          currentActiveSprint?.linkedStories.includes(currentTask.taskId)
        );
      const currentFinishedTasks: number = currentSprintTasks.filter(
        (currentTask) => currentTask.status === "Finished"
      ).length;
      const currentWorkedHours: number = currentSprintTasks.reduce(
        (acc, counter) => {
          const currentTaskWorkingHours: number = counter.clockTime.reduce(
            (accChild, counterChild) => {
              return accChild + counterChild.recordedTime;
            },
            0
          );
          return acc + currentTaskWorkingHours;
        },
        0
      );

      setCurrentWorkingHours(currentWorkedHours);
      setCurrentFinishedTasks(currentFinishedTasks);
    }
  }, [currentWorkSpace?.container]);

  React.useEffect(() => {
    const currentActiveSprint: ISprintsData | undefined =
      currentWorkSpace?.container.sprints?.find(
        (currentSprint) => currentSprint.isSprintActive
      );

    if (currentActiveSprint && currentWorkSpace?.container.wspData) {
      const currentSprintTasks: IDataToDo[] = currentWorkSpace?.container?.wspData.filter((currentTask) => currentActiveSprint?.linkedStories.includes(currentTask.taskId));
      const currentClockRecords: IClockTime[] = currentSprintTasks.flatMap((currentBlock) => currentBlock.clockTime);
      const currentRecordStats: any[] = [];

      currentClockRecords.forEach((currentRecordClocked: IClockTime) => {
        const { recordedBy, recordedTime, registrationDate } = currentRecordClocked;
        const recordedByName: string = recordedBy.fullname ?? "";
        const newObjectToRender = { name: registrationDate, [recordedByName]: recordedTime };

        currentRecordStats.push(newObjectToRender);
      });

      setCurrentSprintHoursStats(currentRecordStats);
    }
  }, [currentWorkSpace?.container.wspData]);

  console.log(currentSprintHoursStats);

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
          isOpen={openSprintModal}
          onClose={setOpenSprintModal}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <UpdateSprint
          sprintId={selectedSprint ?? ""}
          setSprintId={setSelectedSprint}
          isOpen={openEditSprintModal}
          onClose={setOpenEditSprintModal}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Box bgColor={"white"} style={{ height: "100vh" }}>
          <Box
            id="scopesHeaderBox"
            pl={"20px"}
            pr={"30px"}
            display={"flex"}
            justifyContent={"space-between"}
            height={"6%"}
            borderBottom={"2px solid #d9d9e3"}
            bgColor={"rgba(247,247,248,1)"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Button
                size={"sm"}
                fontSize={"20px"}
                bgColor={"transparent"}
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
                <Text> Volver al tablero</Text>
              </Button>

              <Button
                size={"sm"}
                fontSize={"20px"}
                bgColor={"transparent"}
                marginLeft={"15px"}
                aria-label="add sprint"
                fontWeight={"normal"}
                onClick={() => {
                  setAddTask(true);
                }}
              >
                <Icon marginRight={"10px"} as={IoAddCircleOutline} />
                <Text>Añadir historia</Text>
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
                <Text> Gestor de objetivos {currentWorkSpace?.name}</Text>
              </Tag>
            </Box>
          </Box>
          <Box display={"flex"} height={"94%"}>
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
                  marginTop={"10px"}
                  display={"flex"}
                  flexDir={"column"}
                  alignItems={"self-start"}
                  justifyContent={"center"}
                  height={"12%"}
                >
                  <Text
                    cursor={"default"}
                    display={"flex"}
                    alignItems={"center"}
                    fontSize={"15px"}
                    textAlign={"start"}
                    marginBottom={"-5px"}
                    color="gray"
                  >
                    Tablero Kanban / {currentWorkSpace?.name}
                  </Text>
                  <Text
                    cursor={"default"}
                    display={"flex"}
                    alignItems={"center"}
                    fontSize={"20px"}
                    textAlign={"start"}
                  >
                    Backlog
                  </Text>
                </Box>
                <Box height={"88%"}>
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
                                  <Box mt={"-1"}>
                                    {currentMappedChildren[1].map(
                                      (currentTaskChildren, index) => {
                                        return (
                                          <ScopeCardComponent
                                            currentTaskChildren={
                                              currentTaskChildren
                                            }
                                            index={index}
                                            totalItems={
                                              currentMappedChildren[1].length
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
                        {currentSprintActive?.sprintPurpose ?? "Sin establecer"}
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
                        fontSize={"12px"}
                        textAlign={"justify"}
                        colorScheme="messenger"
                        padding={"10px"}
                        width={"100%"}
                      >
                        {currentSprintActive?.sprintDescription ??
                          "Crea e inicia un objetivo para llevar un seguimiento de las estadísticas y el progreso en este apartado"}
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

                  <Box
                    padding={"30px 50px 20px 0px"}
                    borderTop={"2px solid #d9d9e3"}
                    borderBottom={"2px solid #d9d9e3"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    marginTop={"40px"}
                  >
                    <AreaChart
                      width={500}
                      height={200}
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
                      <Area
                        type="monotone"
                        dataKey="hdsaenz"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                    </AreaChart>
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
                      Horas completadas: {currentWorkingHours}
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
                      Finalizadas: {currentFinishedTasks}
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
                            {currentSprintActive?.sprintStartDate
                              ? DateTime.fromISO(
                                  currentSprintActive?.sprintStartDate
                                )
                                  .setLocale("es")
                                  .toFormat("LLLL")
                                  .toUpperCase()
                              : "Vacío"}
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
                          {currentSprintActive?.sprintStartDate
                            ? DateTime.fromISO(
                                currentSprintActive?.sprintStartDate
                              ).toFormat("d")
                            : "00"}
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
                            {currentSprintActive?.sprintEndDate
                              ? DateTime.fromISO(
                                  currentSprintActive?.sprintEndDate
                                )
                                  .setLocale("es")
                                  .toFormat("LLLL")
                                  .toUpperCase()
                              : "Vacío"}
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
                          {currentSprintActive?.sprintEndDate
                            ? DateTime.fromISO(
                                currentSprintActive?.sprintEndDate
                              ).toFormat("d")
                            : "00"}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
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
                    setOpenSprintModal(true);
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
                  {currentWorkSpace?.container?.sprints &&
                    currentWorkSpace?.container?.sprints?.length > 0 && (
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
                                    isDisabled={
                                      currentWorkSpace?.container?.sprints?.find(
                                        (currentSprint) =>
                                          currentSprint.isSprintActive
                                      )
                                        ? true
                                        : false
                                    }
                                    size={""}
                                    onClick={() => {
                                      setSelectedSprint(currentSprint.sprintId);
                                      setOpenEditSprintModal(true);
                                    }}
                                  >
                                    <Icon
                                      w={8}
                                      h={8}
                                      as={HiOutlinePlayCircle}
                                    />
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
