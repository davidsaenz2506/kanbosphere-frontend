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
import { IDataToDo } from "@/domain/entities/todo.entity";
import { CreateWorkSpaces } from "@/services/workspaces/createWorkSpace";
import { getAllWorkSpaces } from "@/services/workspaces/getAll";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";

interface IWspUser {
  name: string;
  createdDate: Date;
  createdById: string;
  type: string;
  wspData: IDataToDo[];
  spreadSheetData: ISpreadSheet;
}

const OpenWorkSpace = ({ isOpen, title, setIsOpen }) => {
  const [nameValue, setNameValue] = useState("");

  const wspUser = useWorkspace();

  const currentUserInfo = useCurrentUser();

  const computedUserDataField = useCurrentUser();

  const [newWorkSpace, setNewWorkSpace] = useState<IWspUser>({
    name: "",
    createdDate: DateTime.now().toISO(),
    createdById: "",
    type: "",
    wspData: [],
    spreadSheetData: {
      columns: [],
      data: [],
      userId: currentUserInfo.currentUser.userID,
    },
  });

  async function handleCreate() {
    await CreateWorkSpaces(newWorkSpace);
    const response = await getAllWorkSpaces(
      computedUserDataField.currentUser.userID
    );

    wspUser.setUsersWsps(response);

    setIsOpen(false);
  }

  React.useEffect(() => {
    setNewWorkSpace({
      name: nameValue,
      createdDate: DateTime.now().toISO(),
      createdById: currentUserInfo.currentUser.userID,
      type: title,
      wspData: [],
      spreadSheetData: {
        columns: [],
        data: [],
        userId: currentUserInfo.currentUser.userID,
      },
    });
  }, [nameValue]);

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
