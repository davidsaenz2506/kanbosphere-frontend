import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Text, Image } from "@nextui-org/react";
import _ from "lodash";

import { DateTime } from "luxon";

import Select, { SingleValue } from "react-select";
import { IPicklistOptions } from "./AddTask";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import FileViewer from "./FileViewer";
import Loading from "@/components/molecules/Loading";
import { Box, FormLabel, Portal, Textarea } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { UpdateCard } from "@/services/workspaces/updateCard";

const EditTask = ({ isOpen, onClose, data, setIsLoading }) => {
  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const statusOptions = [
    { value: "In Proccess", label: "In Proccess" },
    { value: "Finished", label: "Finished" },
    { value: "For Review", label: "For Review" },
    { value: "Blocked", label: "Blocked" },
    { value: "New", label: "New" },
  ];
  const priorityOptions: IPicklistOptions[] = [
    { label: "Baja", value: "low", color: "#C7E9FF" },
    { label: "Media", value: "half", color: "#FFE6B3" },
    { label: "Alta", value: "high", color: "#FFC6A5" },
    { label: "Crítica", value: "critical", color: "#FFC1F3" },
  ];
  const [newDate, setNewDate] = useState(
    DateTime.fromISO(data.createDate).toISODate()
  );
  const [finishDate, setFinishDate] = useState(
    DateTime.fromISO(data?.finishDate).toISODate()
  );
  const [status, setStatus] = useState({
    value: data.status,
    label: data.status,
  });
  const [priority, setPriority] = useState({
    value: data.priority?.value,
    label: data.priority?.value,
    color: data.priority?.color,
  });
  const [description, setDescription] = useState<string>(data?.description);
  const [taskInfo, setTaskInfo] = useState(data.info);
  const [pathImage, setPathImage] = useState(data.file);
  const [openModalForFiles, setOpenModalForFiles] = useState(false);
  const [loadingAsyncEdit, setLoadingAsyncEdit] = useState(false);
  const ref = useRef<Element | null>(null);
  const toastNotification = useToast();
  const marginStatusValue = 4;

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#root");
  }, []);

  const [modifiedTask, setModifiedTask] = useState({
    userId: data.userId,
    taskId: data.taskId,
    status: status.label,
    priority: priority,
    description: description,
    info: taskInfo,
    title: data.title,
    file: pathImage,
    createDate: DateTime.fromISO(newDate).toISO(),
    finishDate: finishDate,
  });

  useEffect(() => {
    var debounceFiles = _.debounce(() => {
      setTaskInfo(data.info);
      setStatus({
        value: data.status,
        label: data.status,
      });
      setPriority({
        value: data.priority?.value,
        label: data.priority?.value,
        color: data.priority?.color,
      });
      setPathImage(data.file);
      setNewDate(DateTime.fromISO(data.createDate).toISODate());
    }, 300);

    debounceFiles();
  }, [isOpen]);

  useEffect(() => {
    setModifiedTask({
      userId: data.userId,
      taskId: data.taskId,
      status: status.label,
      description: description,
      priority: priority,
      info: taskInfo,
      title: data.title,
      file: pathImage,
      createDate: DateTime.fromISO(newDate).toISO(),
      finishDate: finishDate,
    });
  }, [status, newDate, taskInfo, pathImage, finishDate, priority, description]);

  function handlePathImage(argument: string | ArrayBuffer | null) {
    setPathImage(argument);
    setModifiedTask({
      userId: data.userId,
      taskId: data.taskId,
      status: status.label,
      description: description,
      priority: priority,
      info: taskInfo,
      title: data.title,
      file: argument,
      createDate: DateTime.fromISO(newDate).toISO(),
      finishDate: finishDate,
    });
  }

  async function editCurrentTask(currentTask: any) {
    let workspaceData: IDataToDo[] | undefined = wspData.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    let modifiedWorkSpaceData = workspaceData?.map((task, index) => {
      if (task.taskId === currentTaskUser.taskId && workspaceData)
        workspaceData[index] = currentTaskUser;
    });

    setUserTasks({ ...wspData, data: modifiedWorkSpaceData });
  }

  async function handleSendNewTask() {
    try {
      await UpdateCard(wspData._id, modifiedTask);

      editCurrentTask(modifiedTask);
      setIsLoading(false);

      toastNotification({
        title: "Correcto",
        description:
          "¡Sus datos se han guardado con éxito en la base de datos de Tumble!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose(false);
    } catch (error) {
      console.error(error);
    }
  }

  function deleteFileFromDirectory() {
    setModifiedTask({
      userId: data.userId,
      taskId: data.taskId,
      status: status.label,
      priority: priority,
      description: description,
      info: taskInfo,
      title: data.title,
      file: "",
      createDate: DateTime.fromISO(newDate).toISO(),
      finishDate: finishDate,
    });
    editCurrentTask(modifiedTask);

    setOpenModalForFiles(false);
  }

  return (
    <React.Fragment>
      <FileViewer
        openModalForFiles={openModalForFiles}
        setOpenModalForFiles={setOpenModalForFiles}
        pathImage={pathImage}
        deleteFileFromDirectory={deleteFileFromDirectory}
      />
      <Modal
        style={{ height: "80vh" }}
        open={isOpen}
        onClose={() => onClose(false)}
        width="1000px"
      >
        <Modal.Header>
          {" "}
          <Text id="modal-title" size={25} style={{ marginBottom: "-10px" }}>
            Editar Tarea
          </Text>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexDirection: "row" }}>
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
            <Textarea
              value={taskInfo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTaskInfo(e.target.value)
              }
              minHeight={250}
            />

            <FormLabel mt={marginStatusValue}>Status</FormLabel>
            <Select
              value={status}
              options={statusOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) {
                  if (e.value === "Finished" || e.value === "For Review")
                    setFinishDate(DateTime.now().toISO());
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
                    color: e.color,
                  });
                }
              }}
            />
            <FormLabel mt={marginStatusValue}>Fecha de inicio</FormLabel>
            <Input
              type="date"
              width="100%"
              initialValue={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </Box>

          <Box style={{ width: "40%", padding: "20px" }}>
            <FormLabel>Imagenes y documentos</FormLabel>
            <div className="mb-4">
              <input
                onChange={(e: any) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const userFiles: any = e.target.files[0];

                    if (userFiles.type.includes("image")) {
                      const inputComputedReader = new FileReader();
                      inputComputedReader.readAsDataURL(userFiles);

                      inputComputedReader.onload = () => {
                        handlePathImage(inputComputedReader.result);
                      };
                    }
                  }
                }}
                className="form-control"
                type="file"
                id="formFile"
              />
            </div>

            {pathImage && modifiedTask.file && (
              <React.Fragment>
                <label style={{ textAlign: "center", marginBottom: "10px" }}>
                  Archivos adjuntos
                </label>
                <Image
                  onClick={() => setOpenModalForFiles(true)}
                  style={{ borderRadius: "20px" }}
                  src={pathImage}
                />
              </React.Fragment>
            )}
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onClose(false)} auto flat color="error">
            Close
          </Button>
          <Button
            onPress={async () => {
              try {
                setIsLoading(true);
                setTimeout(() => {
                  handleSendNewTask();
                }, 1000);
              } catch (error) {
                toastNotification({
                  title: "Ups, algo ha ocurrido...",
                  description: "Comprueba tu conexión a Internet.",
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                });
              }
            }}
            auto
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default EditTask;
