import React, { useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Button, Input, FormControl, FormLabel } from "@chakra-ui/react";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

import { DateTime } from "luxon";
import { CreateWorkSpaces } from "@/services/workspaces/createWorkSpace";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const OpenWorkSpace = ({ isOpen, title, setIsOpen, setIsLoading }) => {
  const [nameValue, setNameValue] = useState<string>("");
  const [currentPrefix, setCurrentPrefix] = useState<string>("");
  const wspUser: IWspContext = useWorkspace();
  const currentUserInfo: ICurrentUserContext = useCurrentUser();

  const [newWorkSpace, setNewWorkSpace] = useState<IWspUser>({
    name: "",
    prefix: "",
    createdDate: DateTime.now().toISO(),
    createdById: "",
    type: "",
    ...(title === "agile"
      ? { wspData: [] }
      : {
          spreadSheetData: {
            columns: [],
            data: [],
            userId: currentUserInfo.currentUser.userID,
          },
        }),
    ...(title === "agile" ? { wspDataPreferences: { selectedTask: "" } } : {}),
    sharedWith: [],
  });

  async function handleCreate() {
    setIsLoading(true);

    const createdWorkspace = await CreateWorkSpaces(newWorkSpace);
    wspUser.setUsersWsps([...wspUser.userWsps, createdWorkspace.data]);

    setIsLoading(false);

    setIsOpen(false);
  }

  React.useEffect(() => {
    setNewWorkSpace({
      ...newWorkSpace,
      name: nameValue,
      prefix: currentPrefix,
      createdDate: DateTime.now().toISO(),
      createdById: currentUserInfo.currentUser.userID,
      type: title,
    });
  }, [nameValue, currentPrefix]);

  React.useEffect(() => {
    setNewWorkSpace({
      name: "",
      prefix: "",
      createdDate: DateTime.now().toISO(),
      createdById: "",
      type: "",
      ...(title === "agile"
        ? { wspData: [] }
        : {
            spreadSheetData: {
              columns: [],
              data: [],
              userId: currentUserInfo.currentUser.userID,
            },
          }),
      ...(title === "agile" ? { wspDataPreferences: { selectedTask: "" } } : {}),
      sharedWith: [],
    });
  }, [title]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear {title} workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre de tu nuevo workspace</FormLabel>
              <Input
                placeholder="Workspace name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNameValue(e.target.value)
                }
              />
            </FormControl>
            {title === "agile" && (
              <FormControl pt={6}>
                <FormLabel>Escribe el prefijo de tus objetivos</FormLabel>
                <Input
                  placeholder="Ej: TMS, TD, DSW"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentPrefix(e.target.value)
                  }
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleCreate()}>
              Crear
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OpenWorkSpace;
