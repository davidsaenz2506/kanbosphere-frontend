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
} from "@chakra-ui/react";

import Select, { SingleValue } from "react-select";
import { IDataToDo } from "@/domain/entities/todo.entity";

import { DateTime } from "luxon";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { UpdateWorkSpace } from "@/services/workspaces/update";

export interface IPicklistOptions {
  value: string;
  label: string;
}

const AddTask = ({ isOpen, onClose }) => {
  const { currentWorkSpace: data, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const [status, setStatus] = useState<string>("");
  const [taskInfo, setTaskInfo] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [taskId, setTaskId] = useState<string>(
    Math.random().toString(36).substr(2, 18)
  );

  const [task, setTask] = useState<IDataToDo>({
    userId: "1000933190",
    taskId: "",
    status: "",
    info: "",
    title: "",
    createDate: DateTime.now(),
  });

  const statusOptions: IPicklistOptions[] = [
    { value: "In Proccess", label: "In Proccess" },
    { value: "Finished", label: "Finished" },
    { value: "For Review", label: "For Review" },
    { value: "Blocked", label: "Blocked" },
    { value: "New", label: "New" },
  ];

  useEffect(() => {
    setTask({
      userId: "1000933190",
      taskId: taskId,
      status: status,
      info: taskInfo,
      title: title,
      createDate: DateTime.now().toISO(),
    });
  }, [status, taskInfo, title]);

  async function addTaskToWorkSpace(userTask: IDataToDo) {
    let workspaceData: IDataToDo[] = data.wspData;
    let newTask: IDataToDo = userTask;

    workspaceData.push(newTask);

    setUserTasks({ ...data, wspData: workspaceData });

    await UpdateWorkSpace(data);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Añadir tarea</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl style={{ marginBottom: "20px" }}>
            <FormLabel>Titulo</FormLabel>
            <Input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Información</FormLabel>
            <Input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
  );
};

export default AddTask;
