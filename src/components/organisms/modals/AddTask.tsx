import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Portal,
} from "@chakra-ui/react";

import Select, { SingleValue } from "react-select";
import { IDataToDo, IPriority } from "@/domain/entities/todo.entity";

import { DateTime } from "luxon";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import currentBiridectionalCommunication from "@/services/socket";
import { AddCard } from "@/services/workspaces/addCard";
import Loading from "@/components/molecules/Loading";

export interface IPicklistOptions {
  value: string;
  label: string;
  color?: string;
}

const AddTask = ({ isOpen, onClose, isLoading, setIsLoading }) => {
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
  const [file, setFile] = useState<string>("");
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
    file: "",
    createDate: DateTime.now(),
  });

  const statusOptions: IPicklistOptions[] = [
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
    });
  }, [status, taskInfo, title, selectedPriority]);

  async function addTaskToWorkSpace(userTask: IDataToDo) {
    setIsLoading(true);
    let workspaceData: IDataToDo[] | undefined = data.wspData;
    let newTask: IDataToDo = userTask;

    if (workspaceData) workspaceData.push(newTask);

    setUserTasks({ ...data, wspData: workspaceData });

    await AddCard(data._id, newTask);
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      {isLoading && (
        <Portal>
          <Loading message="Agregando nueva tarea" />
        </Portal>
      )}
      <Modal isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir tarea {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Título</FormLabel>
              <Input
                type="text"
                sx={{ marginBottom: "20px" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Información</FormLabel>
              <Textarea
                size="lg"
                sx={{
                  height: "120px",
                  fontSize: "1rem",
                }}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTaskInfo(e.target.value)
                }
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                options={statusOptions}
                onChange={(e: SingleValue<IPicklistOptions>) => {
                  if (e) setStatus(e.label);
                }}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Priority</FormLabel>
              <Select
                options={priorityOptions}
                onChange={(e: SingleValue<IPicklistOptions>) => {
                  if (e)
                    setSelectedPriority({ value: e.label, color: e.color });
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                addTaskToWorkSpace(task);
                setTaskId(Math.random().toString(36).substr(2, 18));
                onClose(false);
              }}
            >
              Crear
            </Button>
            <Button onClick={() => onClose(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default AddTask;
