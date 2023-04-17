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

const DeleteTask = (props) => {
  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const ref = useRef(null);

  async function deleteCurrentTask(currentTask: IDataToDo) {
    let workspaceData: IDataToDo[] = wspData.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    let modifiedWorkSpaceData = workspaceData.map((task, index) => {
      if (task.taskId === currentTaskUser.taskId) {
        workspaceData.splice(index, 1);
      }

      return task;
    });

    setUserTasks({ ...wspData, data: modifiedWorkSpaceData });
  }

  return (
    <>
      <AlertDialog
        isOpen={props.isOpen}
        onClose={props.onClose}
        leastDestructiveRef={ref}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar tarea
            </AlertDialogHeader>

            <AlertDialogBody>
              Estas a punto de eliminar la siguiente tarea: {props.data.title}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => props.onClose(false)}>Cancelar</Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={async () => {
                  deleteCurrentTask(props.data);
                  await UpdateWorkSpace(wspData);
                  props.onClose(false);
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
