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

import { DeleteCurrentWorkSpace } from "@/services/workspaces/deleteWorkSpace";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";

import { useRouter } from "next/router";

const DeleteWorkSpace = (props) => {
  const ref = useRef(null);
  const workSpace = useWorkspace();

  const router = useRouter();

  async function handleDeleteWorkSpace(wspId: string) {
    let workSpacesList: IWspUser[] = workSpace.userWsps;

    workSpacesList.forEach((individualItemEnable, workspaceIndex) => {
      if (individualItemEnable._id === wspId) {
        workSpacesList.splice(workspaceIndex, 1);
      }
    });

    workSpace.setUsersWsps(workSpacesList);
    router.push("/dashboard?=briefcase=main");

    await DeleteCurrentWorkSpace(props.data?._id);
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
              Eliminar WorkSpace
            </AlertDialogHeader>

            <AlertDialogBody>
              Estas a punto de eliminar el siguiente workspace:{" "}
              {props.data?.name}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => props.onClose(false)}>Cancelar</Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => {
                  handleDeleteWorkSpace(props.data?._id);
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

export default DeleteWorkSpace;
