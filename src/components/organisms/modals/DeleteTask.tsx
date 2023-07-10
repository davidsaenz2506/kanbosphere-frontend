import React, { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { DeleteCard } from "@/services/workspaces/deleteCard";

interface IDeleteComponentProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  data: IDataToDo;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteTask: React.FC<IDeleteComponentProps> = (props) => {
  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const ref = useRef(null);
  const { isOpen, setIsLoading, onClose, data } = props;

  async function deleteCurrentTask(currentTask: IDataToDo) {
    let workspaceData: IDataToDo[] | undefined = wspData.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    let modifiedWorkSpaceData = workspaceData?.map((task, index) => {
      if (task.taskId === currentTaskUser.taskId) {
        workspaceData?.splice(index, 1);
      }
      return task;
    });

    setUserTasks({ ...wspData, data: modifiedWorkSpaceData });
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={() => {
          onClose(false);
        }}
        leastDestructiveRef={ref}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar tarea
            </AlertDialogHeader>

            <AlertDialogBody>
              Estas a punto de eliminar la siguiente tarea: {data.title}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => onClose(false)}>Cancelar</Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={async () => {
                  setIsLoading(true);
                  deleteCurrentTask(props.data);
                  await DeleteCard(wspData._id, { taskId: props.data.taskId });
                  setIsLoading(false);
                  onClose(false);
                }}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteTask;
