import React, { useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";

import { Button, Input, FormControl, FormLabel } from "@chakra-ui/react";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

import { DateTime } from "luxon";
import { CreateWorkSpaces } from "@/services/workspaces/createWorkSpace";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { IWspUser } from "@/domain/entities/userWsps.entity";

interface IEditTaskProps {
  isOpen: boolean;
  title: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfettiAction: () => void;
}

const OpenWorkSpace: React.FunctionComponent<IEditTaskProps> = (props) => {
  const { isOpen, title, setIsOpen, handleConfettiAction } = props;
  const [nameValue, setNameValue] = useState<string>("");
  const [currentPrefix, setCurrentPrefix] = useState<string>("");
  const wspUser: IWspContext = useWorkspace();
  const currentUserInfo: ICurrentUserContext = useCurrentUser();
  const [sendingStatus, setSendingStatus] = useState<boolean>(false);

  async function handleCreate() {
    const newWorkspaceToCreate: Partial<IWspUser> = {};
    setSendingStatus(true);

    if (title === "agile") {
      newWorkspaceToCreate.createdDate = DateTime.now().toString();
      newWorkspaceToCreate.name = nameValue;
      newWorkspaceToCreate.createdById = currentUserInfo.currentUser.userID;
      newWorkspaceToCreate.type = title;
      newWorkspaceToCreate.collaborators = [
        {
          _id: currentUserInfo.currentUser._id ?? "",
          name: currentUserInfo.currentUser.username,
          role: "HOST",
        },
      ];
      newWorkspaceToCreate.container = {
        wspData: [],
        containerPreferences: {
          prefix: currentPrefix,
          selectedTask: null,
        },
      };
    }

    if (title === "spreadsheet") {
      newWorkspaceToCreate.createdDate = DateTime.now().toString();
      newWorkspaceToCreate.createdById = currentUserInfo.currentUser.userID;
      newWorkspaceToCreate.type = title;
      newWorkspaceToCreate.name = nameValue;
      newWorkspaceToCreate.collaborators = [
        {
          _id: currentUserInfo.currentUser._id ?? "",
          name: currentUserInfo.currentUser.username,
          role: "HOST",
        },
      ];
      newWorkspaceToCreate.container = {
        spreadSheetData: {
          columns: [],
          data: [],
          userId: currentUserInfo.currentUser.userID,
        },
        containerPreferences: {
          isRowSelectionActive: true,
          isMultipleSelectionActive: false,
          freezedColumns: 0,
        },
      };
    }

    const createdWorkspace = await CreateWorkSpaces(newWorkspaceToCreate);

    if (createdWorkspace.data) {
      wspUser.setUsersWsps([...wspUser.userWsps, createdWorkspace.data]);

      setSendingStatus(false);
      setIsOpen(false);

      setTimeout(() => {
        handleConfettiAction();
      }, 500);
    }
  }

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
              {sendingStatus && <Spinner />}
              {!sendingStatus && <>Crear</>}
            </Button>
            <Button isDisabled={sendingStatus} onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OpenWorkSpace;
