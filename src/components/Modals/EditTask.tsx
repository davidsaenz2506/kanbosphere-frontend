import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Popover, Text } from "@nextui-org/react";
import _ from "lodash";

import { DateTime } from "luxon";

import Select, { SingleValue } from "react-select";
import { IPicklistOptions } from "./AddTask";
import {
  IClockTime,
  IDataToDo,
  IFilePath,
} from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import {
  Box,
  FormLabel,
  Input,
  Button,
  Image,
  Progress,
  Icon,
  TableContainer,
  Table,
  Thead,
  Avatar,
  IconButton,
  Tbody,
  Td,
  Th,
  Tr,
  Spinner,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { UpdateCard } from "@/services/workspaces/updateCard";

import { storage } from "@/storage/firebaseClient";
import {
  StorageReference,
  getDownloadURL,
  ref as refStorageObject,
  uploadString,
  deleteObject,
} from "firebase/storage";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { customAlphabet } from "nanoid";
import QuillEditor from "../RichText.tsx";

import { RxLapTimer } from "react-icons/rx";
import { getSchemeByValue } from "../SlideTask";
import PopoverComponent from "../Popover/General";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import currentBiridectionalCommunication from "@/services/socket";

const statusOptions = [
  { value: "In Proccess", label: "In Proccess" },
  { value: "Finished", label: "Finished" },
  { value: "For Review", label: "For Review" },
  { value: "Blocked", label: "Blocked" },
  { value: "New", label: "New" },
];

const priorityOptions: IPicklistOptions[] = [
  { label: "Baja", value: "low", color: "#FFB266 " },
  { label: "Media", value: "half", color: "#66B2FF" },
  { label: "Alta", value: "high", color: "#FF99FF" },
  { label: "Crítica", value: "critical", color: "#FF9999" },
];

const stringDataForUniqueId: string =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const EditTask = ({ isOpen, onClose, data, isLoading, setIsLoading }) => {
  const uniqueIdFactory = customAlphabet(stringDataForUniqueId, 12);
  const { currentUser } = useCurrentUser();
  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const [newDate, setNewDate] = useState(data?.createDate);
  const [finishDate, setFinishDate] = useState(data?.finishDate);
  const [status, setStatus] = useState({
    value: "",
    label: "",
  });
  const [priority, setPriority] = useState({
    value: "",
    label: "",
    color: "",
  });
  const [description, setDescription] = useState<string>("");
  const [taskInfo, setTaskInfo] = useState("");
  const [pathImage, setPathImage] = useState<IFilePath[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isGettingImage, setIsGettingImage] = useState<boolean>(false);
  const [stringPathToRender, setStringPathToRender] = useState<IFilePath[]>([]);
  const [clockTime, setClockTime] = useState<IClockTime[]>([]);
  const [expectedHours, setExpectedHours] = useState<number>(0);
  const [totalHoursRecorded, setTotalHoursRecorder] = useState<number>(0);
  const [individualClockRegister, setIndividualClockRegister] =
    useState<IClockTime>({
      recordedTime: 0,
      registrationDate: DateTime.fromISO(DateTime.now()).toISODate(),
      recordedBy: {
        _id: currentUser._id,
        fullname: currentUser.fullname,
      },
    });
  const [currentPathSelected, setCurrentPathSelected] = useState<any>({
    name: "",
    relativePath: "",
    index: null,
  });
  const [openModalForFiles, setOpenModalForFiles] = useState(false);
  const [currentTaskStorageRefs, setCurrentTaskStorageRefs] = useState<
    StorageReference[]
  >([]);
  const ref = useRef<Element | null>(null);
  const toastNotification = useToast();
  const marginStatusValue = 4;

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#root");
  }, []);

  const [modifiedTask, setModifiedTask] = useState<IDataToDo>({
    userId: "",
    taskId: "",
    status: "",
    priority: priority,
    description: "",
    info: "",
    title: "",
    file: undefined,
    clockTime: [],
    expectedWorkingHours: 0,
    createDate: undefined,
    finishDate: undefined,
  });

  useEffect(() => {
    setModifiedTask({
      userId: data?.userId,
      taskId: data?.taskId,
      status: status.label,
      description: description,
      priority: priority,
      info: taskInfo,
      title: data?.title,
      file: pathImage,
      clockTime: clockTime,
      expectedWorkingHours: expectedHours,
      createDate: newDate,
      finishDate: finishDate,
    });
  }, [
    status,
    newDate,
    taskInfo,
    pathImage,
    finishDate,
    priority,
    description,
    clockTime,
  ]);

  React.useEffect(() => {
    setDescription(data?.description);
    setTaskInfo(data?.info);
    setPathImage(data?.file ?? []);
    setStatus({
      value: data?.status,
      label: data?.status,
    });
    setPriority({
      value: data?.priority?.value,
      label: data?.priority?.value,
      color: data?.priority?.color,
    });
    setNewDate(data?.createDate);
    setFinishDate(data?.finishDate);
    setExpectedHours(data?.expectedWorkingHours);
    setClockTime(data?.clockTime);

    setCurrentTaskStorageRefs([]);
  }, [data]);

  React.useEffect(() => {
    setTotalHoursRecorder(
      clockTime?.reduce((acc, record) => acc + record.recordedTime, 0)
    );
  }, [clockTime]);

  React.useEffect(() => {
    if (pathImage.length > 0) {
      const currentStorageRefsMatrix: StorageReference[] = [];
      for (const currentPathObject of pathImage) {
        const storageRef: StorageReference = refStorageObject(
          storage,
          currentPathObject.relativePath
        );
        currentStorageRefsMatrix.push(storageRef);
      }

      setCurrentTaskStorageRefs(currentStorageRefsMatrix);
    } else setStringPathToRender([]);
  }, [pathImage]);

  React.useEffect(() => {
    if (pathImage.length > 0 && isOpen) getFileDataFromFirebase();
  }, [isOpen]);

  async function getFileDataFromFirebase() {
    const currentUrlData: IFilePath[] = [];
    setIsGettingImage(true);
    try {
      for (const currentFileRef of currentTaskStorageRefs) {
        const downloadUrl: string = await getDownloadURL(currentFileRef);
        currentUrlData.push({
          name: currentFileRef.name,
          relativePath: downloadUrl,
        });
      }
      setIsGettingImage(false);
    } catch (error) {
      setIsGettingImage(false);
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Error al obtener datos, intentalo de nuevo más tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setStringPathToRender(currentUrlData);
  }

  async function editCurrentTask(currentTask: any) {
    const currentWorkSpace : IWspUser | undefined = wspData;
    let workspaceData: IDataToDo[] | undefined = wspData?.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    workspaceData?.forEach((task, index) => {
      if (task.taskId === currentTaskUser.taskId && workspaceData) workspaceData[index] = currentTaskUser;
    });

    if (currentWorkSpace?.wspData) currentWorkSpace.wspData = workspaceData;

    setUserTasks(currentWorkSpace);
  }

  async function handleSendNewTask() {
    try {
      await UpdateCard(wspData?._id, {
        body: modifiedTask,
        transactionObject: {
          currentUserSocketId: currentBiridectionalCommunication.id,
          currentRoomToken: {
            roomToken: wspData?._id ?? "",
          },
        },
      });

      editCurrentTask(modifiedTask);
      setIsLoading(false);

      toastNotification({
        title: "Correcto",
        description:
          "¡Historia guardada con exito!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose(false);
    } catch (error) {
      setIsLoading(false);
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Error al actualizar, intentalo de nuevo más tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function deleteFileFromDirectory(indexToDelete: number) {
    const currentModifiedTask = { ...modifiedTask };

    try {
      if (currentModifiedTask.file && currentModifiedTask.file.length > 0) {
        const pathToDelete: string = pathImage[indexToDelete].relativePath;
        const currentRefToDelete: StorageReference = refStorageObject(
          storage,
          pathToDelete
        );
        const mutablePathState: IFilePath[] = stringPathToRender;

        mutablePathState.splice(indexToDelete, 1);

        await deleteObject(currentRefToDelete);

        currentModifiedTask?.file.splice(indexToDelete, 1);
        setStringPathToRender(mutablePathState);
        editCurrentTask(currentModifiedTask);

        setOpenModalForFiles(false);
      }
    } catch (error) {
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description:
          "Error al eliminar de la base de datos, intentalo de nuevo más tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  const handleTimeRegisterChange = (beta: string | number) => {
    if (typeof beta === "string")
      setIndividualClockRegister({
        ...individualClockRegister,
        registrationDate: beta,
      });
    else
      setIndividualClockRegister({
        ...individualClockRegister,
        recordedTime: beta,
      });
  };

  const handleRemoveRecord = (chunkIndex: number) => {
    const updatedClockTime = clockTime.filter(
      (_, index) => index !== chunkIndex
    );
    setClockTime(updatedClockTime);
  };

  return (
    <React.Fragment>
      <Modal
        style={{ borderRadius: "5px", height: "95vh" }}
        open={isOpen}
        onClose={() => onClose(false)}
        width="1300px"
        preventClose
      >
        <Modal.Header>
          {" "}
          <Text id="modal-title" size={25} style={{ marginBottom: "-20px" }}>
            Administrar historia
          </Text>
        </Modal.Header>
        <Modal.Body
           css={{
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#D3D3D3",
              borderRadius: "4px",
            },
          }}
          style={{ display: "flex", flexDirection: "row", cursor: "default" }}
        >
          <Box
            style={{ width: "60%", paddingRight: "20px", paddingLeft: "20px" }}
          >
            <FormLabel mt={marginStatusValue}>Título</FormLabel>
            <Input
              value={description}
              width="100%"
              onChange={(e) => setDescription(e.target.value)}
            />

            <FormLabel mt={marginStatusValue}>Información</FormLabel>
            <QuillEditor
              value={taskInfo}
              onChangeMethod={setTaskInfo}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ size: [] }],
                  [{ font: [] }],
                  [{ align: ["right", "center", "justify"] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ color: [] }],
                  [{ background: [] }],
                ],
              }}
              readOnly={false}
            />

            <FormLabel mt={marginStatusValue}>Registrar tiempo</FormLabel>
            <Box marginTop={"-10px"}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text style={{ fontSize: "13px" }}>
                  El registro de horas es manual, pero estaremos trabajando para
                  automatizar este campo 🚀
                </Text>

                <PopoverComponent
                  content={
                    <Box padding={"10px 30px 20px 30px"}>
                      <Text style={{ marginBottom: "10px" }}>
                        Registrar horas
                      </Text>
                      <Box display={"flex"}>
                        <Box display={"flex"} width={"95%"}>
                          <Input
                            type="date"
                            width="70%"
                            marginRight={"10px"}
                            defaultValue={DateTime.fromISO(
                              DateTime.now()
                            ).toISODate()}
                            onChange={(e) =>
                              handleTimeRegisterChange(
                                DateTime.fromISO(e.target.value).toISODate()
                              )
                            }
                          />
                          <Input
                            type="number"
                            width="30%"
                            placeholder="Horas"
                            value={individualClockRegister.recordedTime}
                            onChange={(e) =>
                              handleTimeRegisterChange(parseInt(e.target.value))
                            }
                          />
                        </Box>
                        <Button
                          variant={"outline"}
                          colorScheme={"whatsapp"}
                          borderRadius={"50%"}
                          marginLeft={"20px"}
                          width={"5%"}
                          isDisabled={
                            !individualClockRegister.recordedTime ? true : false
                          }
                          onClick={() => {
                            setClockTime([
                              ...clockTime,
                              individualClockRegister,
                            ]);
                            setIndividualClockRegister({
                              recordedTime: 0,
                              registrationDate: DateTime.fromISO(
                                DateTime.now()
                              ).toISODate(),
                              recordedBy: {
                                _id: currentUser._id,
                                fullname: currentUser.username,
                              },
                            });
                          }}
                        >
                          <CheckIcon aria-label="register-time" />
                        </Button>
                      </Box>
                    </Box>
                  }
                  trigger={
                    <Button
                      boxShadow={"0 2px 4px rgba(0, 0, 0, 0.2)"}
                      padding={0}
                      width={5}
                    >
                      <Icon
                        w={5}
                        h={5}
                        as={RxLapTimer}
                        aria-label="record-time"
                      />
                    </Button>
                  }
                />
              </Box>

              <Box>
                <Text style={{ fontSize: "13px" }}>
                  Total de horas: {totalHoursRecorded}
                </Text>
                <Progress
                  marginTop={"10px"}
                  bgColor={"gray.300"}
                  value={totalHoursRecorded}
                  colorScheme={getSchemeByValue(
                    totalHoursRecorded,
                    expectedHours
                  )}
                  max={expectedHours}
                />
              </Box>

              {clockTime?.length > 0 && (
                <Box marginTop={"10px"}>
                  <Text style={{ fontSize: "13px", marginBottom: "15px" }}>Hoja de registro</Text>
                  <TableContainer>
                    <Table size="sm" variant='striped' colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign={"center"}>Usuario</Th>
                          <Th textAlign={"center"}>Horas registradas</Th>
                          <Th textAlign={"center"}>Fecha de registro</Th>
                          <Th textAlign={"center"}>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {clockTime?.length > 0 &&
                          clockTime.map(
                            (currentChunk: IClockTime, chunkIndex: number) => {
                              return (
                                <Tr>
                                  <Td fontSize={"13px"} textAlign={"center"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                      <Avatar
                                        w={8}
                                        h={8}
                                        
                                        marginRight={"10px"}
                                      />
                                      {currentChunk.recordedBy.fullname}
                                    </Box>
                                  </Td>
                                  <Td fontSize={"13px"} textAlign={"center"}>
                                    {currentChunk.recordedTime}
                                  </Td>
                                  <Td fontSize={"13px"} textAlign={"center"}>
                                    {currentChunk.registrationDate}
                                  </Td>

                                  <Td display={"flex"} alignItems={"center"} justifyContent={"center"} textAlign={"center"}>
                                    <IconButton
                                      size={"xs"}
                                      borderRadius={"50%"}
                                      colorScheme="red"
                                      
                                      variant={"solid"}
                                      icon={<DeleteIcon />}
                                      aria-label="delete"
                                      onClick={() =>
                                        handleRemoveRecord(chunkIndex)
                                      }
                                    />
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>

            <FormLabel mt={marginStatusValue}>Status</FormLabel>
            <Select
              value={status}
              options={statusOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) {
                  if (e.value === "Finished" || e.value === "For Review")
                    setFinishDate(DateTime.now());
                  setStatus({ value: e.value, label: e.label });
                }
              }}
            />
            <FormLabel mt={marginStatusValue}>Priority</FormLabel>
            <Select
              value={priority}
              options={priorityOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) {
                  // @ts-ignore
                  setPriority({
                    value: e.label,
                    label: e.label,
                    color: e.color ?? "",
                  });
                }
              }}
            />
            <FormLabel mt={marginStatusValue}>Fecha de inicio</FormLabel>
            <Input
              type="date"
              width="100%"
              value={DateTime.fromISO(newDate).toISODate()}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </Box>

          <Box style={{ width: "40%", padding: "20px" }}>
            <FormLabel marginBottom={"10px"}>Dropzone</FormLabel>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              marginBottom={"20px"}
            >
              <Input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="image-input-trigger"
                onChange={(e: any) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const userFiles: any = e.target.files[0];

                    if (userFiles.type.includes("image")) {
                      const inputComputedReader = new FileReader();
                      inputComputedReader.readAsDataURL(userFiles);

                      inputComputedReader.onload = async () => {
                        if (inputComputedReader.result) {
                          try {
                            const uniqueIdFactoryResult: string =
                              uniqueIdFactory();
                            const newPathToFiles: string = `/users/${currentUser._id}/booklets/agile/${wspData?._id}/records/${data?.taskId}/${uniqueIdFactoryResult}`;
                            const provitionalUploadReference: StorageReference =
                              refStorageObject(storage, newPathToFiles);

                            setIsUploadingImage(true);

                            await uploadString(
                              provitionalUploadReference,
                              inputComputedReader.result.toString(),
                              "data_url"
                            );

                            setIsUploadingImage(false);

                            setPathImage([
                              ...pathImage,
                              {
                                name: uniqueIdFactoryResult,
                                relativePath: newPathToFiles,
                              },
                            ]);

                            setStringPathToRender([
                              ...stringPathToRender,
                              {
                                name: uniqueIdFactoryResult,
                                relativePath: await getDownloadURL(
                                  provitionalUploadReference
                                ),
                              },
                            ]);
                          } catch (error) {
                            toastNotification({
                              title: "Ups, algo ha ocurrido...",
                              description: "No se pudo cargar el archivo",
                              status: "error",
                              duration: 4000,
                              isClosable: true,
                            });
                          }
                        }
                      };
                    }
                  }
                }}
              />
              <label htmlFor="image-input-trigger">
                <Box
                  backgroundColor={"rgba(247,247,248, 1)"}
                  padding={"5px 20px 5px 20px"}
                  border={"1px solid #d9d9e3"}
                  borderRadius={"5px"}
                  cursor={"-webkit-grab"}
                >
                  <Text style={{ color: "black" }}>
                    Haga clic aquí para comenzar a cargar imagenes o documentos
                  </Text>
                </Box>
              </label>
            </Box>

            <React.Fragment>
              <FormLabel
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  width: "100%",
                  textAlignLast: "start",
                  borderTop: "1px solid #d9d9e3",
                  paddingTop: "10px",
                }}
              >
                Imagenes adjuntas
              </FormLabel>

              <Box
                display={"flex"}
                paddingBottom={"15px"}
                borderBottom={"1px solid #d9d9e3"}
              >
                {stringPathToRender.length > 0 && !isUploadingImage && (
                  <React.Fragment>
                    {stringPathToRender.map(
                      (currentPath: IFilePath, index: number) => {
                        return (
                          <Box
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            display={"flex"}
                            marginRight={"20px"}
                          >
                            <PopoverComponent
                              content={
                                <Box padding={"10px 30px 20px 30px"}>
                                  <Text style={{ marginBottom: "10px" }}>
                                    Eliminar imagen
                                  </Text>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                  >
                                    <Button
                                      variant={"solid"}
                                      colorScheme={"red"}
                                      borderRadius={"50%"}
                                      width={"5%"}
                                      onClick={() =>
                                        deleteFileFromDirectory(
                                          currentPathSelected.index
                                        )
                                      }
                                    >
                                      <DeleteIcon aria-label="register-time" />
                                    </Button>
                                  </Box>
                                </Box>
                              }
                              trigger={
                                <Image
                                  width={100}
                                  height={100}
                                  onClick={() => {
                                    setCurrentPathSelected({
                                      name: currentPath.name,
                                      relativePath: currentPath.relativePath,
                                      index: index,
                                    });
                                  }}
                                  style={{
                                    borderRadius: "5px",
                                    maxHeight: "100px",
                                    maxWidth: "100px",
                                  }}
                                  boxShadow={"0 2px 4px rgba(0, 0, 0, 0.4)"}
                                  cursor={"-webkit-grab"}
                                  src={currentPath.relativePath}
                                />
                              }
                            />
                            <Text style={{ fontSize: "10px" }}>
                              {currentPath.name}{" "}
                            </Text>
                          </Box>
                        );
                      }
                    )}
                  </React.Fragment>
                )}
                {pathImage.length === 0 &&
                  !isUploadingImage &&
                  !isGettingImage && (
                    <React.Fragment>
                      <Text style={{ width: "100%", textAlign: "center" }}>
                        Por ahora, la sección de archivos está vacía, pero puede
                        agregar archivos en Dropzone
                      </Text>
                    </React.Fragment>
                  )}
                {isUploadingImage && (
                  <Box
                    paddingLeft={"20px"}
                    paddingRight={"20px"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Text style={{ width: "100%", textAlign: "center" }}>
                      Subiendo archivo, esto puede tomar un momento
                    </Text>
                    <Progress size="xs" isIndeterminate />
                  </Box>
                )}
                {(isGettingImage && !stringPathToRender.length) && (
                  <Box
                    paddingLeft={"20px"}
                    paddingRight={"20px"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Text style={{ width: "100%", textAlign: "center" }}>
                      Obteniendo datos, esto puede tomar un momento
                    </Text>
                    <Progress size="xs" isIndeterminate />
                  </Box>
                )}
              </Box>
            </React.Fragment>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button
            backgroundColor={"rgba(33,42,62,1)"}
            color={"white"}
            _hover={{}}
            onClick={async () => {
              try {
                setIsLoading(true);
                setTimeout(async () => {
                  handleSendNewTask();
                }, 1000);
              } catch (error) {
                toastNotification({
                  title: "Ups, algo ha ocurrido...",
                  description: "Comprueba tu conexión a Internet.",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                  position: "bottom-right"
                });
              }
            }}
          >
            {isLoading && (
              <>
                <Spinner marginRight={"15px"} />
                <Text style={{ color: "white" }}>Guardando</Text>
              </>
            )}
            {!isLoading && (
              <>
                <Text style={{ color: "white" }}>Guardar y salir</Text>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default EditTask;
