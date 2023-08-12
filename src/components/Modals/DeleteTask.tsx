import React, { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { DeleteCard } from "@/services/workspaces/deleteCard";
import currentBiridectionalCommunication from "@/services/socket";

interface IDeleteComponentProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  data: IDataToDo;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteTask: React.FC<IDeleteComponentProps> = (props) => {
  const { currentWorkSpace: wspData, setCurrentWorkSpace: setUserTasks } = useCurrentWorkspace();
  const ref = useRef(null);
  const { isOpen, setIsLoading, onClose, data } = props;
  const [isDeletingTask, setIsDeletingTask] = useState<boolean>(false);

  async function deleteCurrentTask(currentTask: IDataToDo) {
    let workspaceData: IDataToDo[] | undefined = wspData?.container?.wspData;
    let currentTaskUser: IDataToDo = currentTask;

    let modifiedWorkSpaceData = workspaceData?.map((task, index) => {
      if (task.taskId === currentTaskUser.taskId) {
        workspaceData?.splice(index, 1);
      }
      return task;
    });

    // @ts-ignore
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

            <AlertDialogBody marginTop={"-20px"} marginBottom={"-20px"}>
              Estas a punto de eliminar la siguiente tarea: {data?.title}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button isDisabled={isDeletingTask} onClick={() => onClose(false)}>Cancelar</Button>
              <Button
                minW={"100px"}
                colorScheme="red"
                ml={3}
                onClick={async () => {
                  setIsLoading(true);
                  setIsDeletingTask(true);
                  await DeleteCard(wspData?._id, {
                    body: { taskId: props.data.taskId },
                    transactionObject: {
                      currentUserSocketId: currentBiridectionalCommunication.id,
                      currentRoomToken: {
                        roomToken: wspData?._id ?? "",
                      },
                    },
                  });
                  deleteCurrentTask(props?.data);

                  setIsDeletingTask(false);
                  setIsLoading(false);
                  onClose(false);
                }}
              >
                {isDeletingTask ? <Spinner /> : "Eliminar"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteTask;
