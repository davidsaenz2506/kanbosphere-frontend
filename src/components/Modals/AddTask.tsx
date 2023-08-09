import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { Modal } from "@nextui-org/react";

import Select, { SingleValue } from "react-select";
import {
  IClockTime,
  IDataToDo,
  IFilePath,
  IPriority,
} from "@/domain/entities/todo.entity";

import { DateTime } from "luxon";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { AddCard } from "@/services/workspaces/addCard";
import QuillEditor from "../RichText.tsx";
import currentBiridectionalCommunication from "@/services/socket";

export interface IPicklistOptions {
  value: string;
  label: string;
  color?: string;
}

const statusOptions: IPicklistOptions[] = [
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

const AddTask = ({ isOpen, onClose, isLoading, setIsLoading }) => {
  const toastNotification = useToast();
  const { currentWorkSpace: data, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const [status, setStatus] = useState<string>("");
  const mathRandomValue = React.useMemo(
    () => Math.floor(Math.random() * 999) + 1,
    [data]
  );
  const formatedValue = mathRandomValue.toString().padStart(3, "0");
  const [taskInfo, setTaskInfo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [clockTime, setClockTime] = useState<IClockTime[]>([]);
  const [file, setFile] = useState<IFilePath[]>([]);
  const [expectedHours, setExpectedHours] = useState<number>(0);
  const [taskId, setTaskId] = useState<string>(
    Math.random().toString(36).substr(2, 18)
  );
  const [selectedPriority, setSelectedPriority] = useState<IPriority>({
    value: "",
    color: "",
  });

  const title = `${data?.prefix}-${formatedValue}`;

  const [task, setTask] = useState<IDataToDo>({
    userId: "1000933190",
    taskId: "",
    status: "",
    priority: selectedPriority,
    description: description,
    info: "",
    title: "",
    file: [],
    createDate: DateTime.now(),
    clockTime: [],
    expectedWorkingHours: expectedHours,
  });

  useEffect(() => {
    setTask({
      userId: "1000933190",
      taskId: taskId,
      status: status,
      description: description,
      priority: selectedPriority,
      info: taskInfo,
      title: title,
      file: file,
      createDate: DateTime.now().toISO(),
      clockTime: clockTime,
      expectedWorkingHours: expectedHours,
    });
  }, [status, taskInfo, title, selectedPriority]);

  async function addTaskToWorkSpace(userTask: IDataToDo) {
    try {
      setIsLoading(true);
      let workspaceData: IDataToDo[] | undefined = data?.wspData;
      let newTask: IDataToDo = userTask;

      if (workspaceData) workspaceData.push(newTask);

      // @ts-ignore
      setUserTasks({ ...data, wspData: workspaceData });

      await AddCard(data?._id, {
        body: newTask,
        transactionObject: {
          currentUserSocketId: currentBiridectionalCommunication.id,
          currentRoomToken: {
            roomToken: data?._id ?? "",
          },
        }
      });
      setIsLoading(false);
    } catch (error) {
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Error al crear historia.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right"
      });
    }
  }

  return (
    <React.Fragment>
      <Modal
        style={{ height: "max-content", borderRadius: "5px" }}
        open={isOpen}
        onClose={() => onClose(false)}
        width="800px"
      >
        <Modal.Header style={{ marginBottom: "-10px", fontSize: "18px" }}>
          Añadir historia {title}
        </Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormLabel>Título</FormLabel>
            <Input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Información</FormLabel>
            <QuillEditor
              value={taskInfo}
              readOnly={false}
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
            />
          </FormControl>

          <FormControl>
            <FormLabel>Horas de trabajo esperadas</FormLabel>
            <Input
              type="number"
              placeholder="Asegúrese de ingresar valores consistentes"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setExpectedHours(parseInt(e.target.value))
              }
            />
          </FormControl>

          <FormControl mt={0}>
            <FormLabel>Status</FormLabel>
            <Select
              options={statusOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) setStatus(e.label);
              }}
            />
          </FormControl>

          <FormControl mt={0}>
            <FormLabel>Priority</FormLabel>
            <Select
              options={priorityOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) setSelectedPriority({ value: e.label, color: e.color });
              }}
            />
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <Button
            backgroundColor={"rgba(33,42,62,1)"}
            mr={3}
            color={"white"}
            _hover={{}}
            onClick={() => {
              addTaskToWorkSpace(task);
              setTaskId(Math.random().toString(36).substr(2, 18));
              onClose(false);
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

          <Button onClick={() => onClose(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default AddTask;
