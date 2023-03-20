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

import { DateTime } from "luxon";

import Select, { SingleValue } from "react-select";
import { IPicklistOptions } from "./AddTask";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";

const EditTask = ({ isOpen, onClose, data }) => {

  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const statusOptions = [
    { value: "In Proccess", label: "In Proccess" },
    { value: "Finished", label: "Finished" },
    { value: "For Review", label: "For Review" },
    { value: "Blocked", label: "Blocked" },
    { value: "New", label: "New" },
  ];
  const [newDate, setNewDate] = useState(
    DateTime.fromISO(data.createDate).toISODate()
  );
  const [status, setStatus] = useState({
    value: data.status,
    label: data.status,
  });
  const [taskInfo, setTaskInfo] = useState(data.info);

  const [modifiedTask, setModifiedTask] = useState({});

  useEffect(() => {
    setModifiedTask({
      userId: data.userId,
      taskId: data.taskId,
      status: status.label,
      info: taskInfo,
      title: data.title,
      createDate: DateTime.fromISO(newDate).toISO(),
    });
  }, [status, newDate, taskInfo]);

  async function editCurrentTask(currentTask: any) {

    let workspaceData: IDataToDo[] = wspData.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    let modifiedWorkSpaceData = workspaceData.map((task, index) => {
      if (task.taskId === currentTaskUser.taskId) {
        workspaceData.splice(index, 1);
        workspaceData.push(currentTaskUser);
      }

      return task;
    });

    setUserTasks({...wspData, data: modifiedWorkSpaceData})
  
  
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar tarea</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Información</FormLabel>
            <Input
              value={taskInfo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTaskInfo(e.target.value)
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              options={statusOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) setStatus({ value: e.value, label: e.label });
              }}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Fecha de Inicio</FormLabel>
            <Input
              type="date"
              value={newDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewDate(e.target.value)
              }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              editCurrentTask(modifiedTask)
              await UpdateWorkSpace(wspData);
              onClose(false)
            }}
          >
            Save
          </Button>
          <Button onClick={() => onClose(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTask;
