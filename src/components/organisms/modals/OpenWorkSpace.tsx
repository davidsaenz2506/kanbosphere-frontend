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

interface IWspUser {
  name: string;
  createdDate: Date;
  createdById: string;
  type: string;
}

const OpenWorkSpace = ({ isOpen, title, setIsOpen }) => {
  const [nameValue, setNameValue] = useState("");

  const wspUser = useWorkspace();

  const [newWorkSpace, setNewWorkSpace] = useState<IWspUser>({
    name: "",
    createdDate: DateTime.now().toISO(),
    createdById: "",
    type: "",
  });

  React.useEffect(() => {
    setNewWorkSpace({
      name: nameValue,
      createdDate: DateTime.now().toISO(),
      createdById: "",
      type: title
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                wspUser.setUsersWsps([...wspUser.userWsps, newWorkSpace]);
                setIsOpen(false);
              }}
            >
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
