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
import { IDataToDo, IPriority } from "@/domain/entities/todo.entity";

import { DateTime } from "luxon";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { AddCard } from "@/services/workspaces/addCard";
import QuillEditor from "../RichText.tsx";
import currentBiridectionalCommunication from "@/services/socket";
import { ICollaborators } from "@/domain/entities/userWsps.entity";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

export interface IPicklistOptions {
  value: string;
  label: string;
  color?: string;
}

const statusOptions: IPicklistOptions[] = [
  { value: "In Proccess", label: "In Proccess" },
  { value: "Finished", label: "Finished" },
  { value: "For Review", label: "For Review" },
  { value: "In Tests", label: "In Tests" },
  { value: "Blocked", label: "Blocked" },
  { value: "New", label: "New" },
];

const typeOptions: IPicklistOptions[] = [
  { value: "history", label: "📘 Historia" },
  { value: "bug", label: "📕 Bug" },
  { value: "review", label: "📒 Revisión" },
  { value: "feature", label: "📙 Feature" },
  { value: "technical", label: "📗 Técnico" },
  { value: "epic", label: "📓 Épico" },
];

const priorityOptions: IPicklistOptions[] = [
  { label: "Baja", value: "low", color: "#FFB266 " },
  { label: "Media", value: "half", color: "#66B2FF" },
  { label: "Alta", value: "high", color: "#FF99FF" },
  { label: "Crítica", value: "critical", color: "#FF9999" },
];

interface IAddTaskProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTask: React.FunctionComponent<IAddTaskProps> = (props) => {
  const toastNotification = useToast();
  const { currentUser } = useCurrentUser();
  const { isOpen, onClose, isLoading, setIsLoading } = props;
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
  const [expectedHours, setExpectedHours] = useState<number>(0);
  const [taskId, setTaskId] = useState<string>(
    Math.random().toString(36).substr(2, 18)
  );
  const [selectedPriority, setSelectedPriority] = useState<IPriority>({
    value: "",
    color: "",
  });
  const [selectedType, setSelectedType] = useState({ value: "", label: "" });
  const containerPreferences = data?.collaborators.find(
    (currentCollaborator: ICollaborators) =>
      currentCollaborator._id === currentUser._id
  )?.containerPreferences;
  const title =
    containerPreferences && "prefix" in containerPreferences
      ? `${containerPreferences.prefix}-${formatedValue}`
      : "undefined";

  const [task, setTask] = useState<IDataToDo>({
    informant: "",
    responsible: "",
    taskId: "",
    status: "",
    type: selectedType,
    priority: selectedPriority,
    description: description,
    info: "",
    title: "",
    file: [],
    createDate: DateTime.now().toISODate(),
    clockTime: [],
    expectedWorkingHours: expectedHours,
  });

  useEffect(() => {
    if (currentUser._id) {
      setTask({
        informant: currentUser._id,
        responsible: currentUser._id,
        taskId: taskId,
        status: status,
        type: selectedType,
        description: description,
        priority: selectedPriority,
        info: taskInfo,
        title: title,
        file: [],
        createDate: DateTime.now().toISODate(),
        clockTime: [],
        expectedWorkingHours: expectedHours,
      });
    }
  }, [status, taskInfo, title, selectedPriority, selectedType]);

  async function addTaskToWorkSpace(userTask: IDataToDo) {
    try {
      setIsLoading(true);
      const workspaceData: IDataToDo[] | undefined = data?.container?.wspData;
      const newTask: IDataToDo = userTask;

      if (workspaceData) workspaceData.push(newTask);

      if (data) {
        setUserTasks({
          ...data,
          container: {
            ...data?.container,
            wspData: workspaceData,
          },
        });

        await AddCard(data?._id, {
          body: newTask,
          transactionObject: {
            currentUserSocketId: currentBiridectionalCommunication.id,
            currentRoomToken: {
              roomToken: data?._id ?? "",
            },
          },
        });
        setIsLoading(false);
      }
    } catch (error) {
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Error al crear historia.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
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
          <FormLabel>Título</FormLabel>
          <Input
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />

          <FormLabel>Tipo de historia</FormLabel>
          <Select
            menuPlacement="auto"
            options={typeOptions}
            onChange={(e: SingleValue<IPicklistOptions>) => {
              if (e) setSelectedType(e);
            }}
          />

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

          <FormLabel>Horas de trabajo esperadas</FormLabel>
          <Input
            type="number"
            placeholder="Asegúrese de ingresar valores consistentes"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setExpectedHours(parseInt(e.target.value))
            }
          />

          <FormLabel>Status</FormLabel>
          <Select
           menuPlacement="auto"
            options={statusOptions}
            onChange={(e: SingleValue<IPicklistOptions>) => {
              if (e) setStatus(e.label);
            }}
          />

          <FormLabel>Priority</FormLabel>
          <Select
           menuPlacement="auto"
            options={priorityOptions}
            onChange={(e: SingleValue<IPicklistOptions>) => {
              if (e) setSelectedPriority({ value: e.label, color: e.color });
            }}
          />
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
