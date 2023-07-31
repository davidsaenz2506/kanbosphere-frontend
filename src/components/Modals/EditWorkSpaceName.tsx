import React, { useState } from "react";
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

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const EditWorkSpaceName = ({ isOpen, onClose, data }) => {
  const { currentWorkSpace: wspData, setCurrentWorkSpace } =
    useCurrentWorkspace();

  const [wspName, setWspName] = useState("");

  async function editCurrentWorkspace(currentWorkSpace: IWspUser) {
    let workSpace = currentWorkSpace;
    workSpace.name = wspName;

    setCurrentWorkSpace({ ...workSpace });
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar workspace</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Nuevo nombre de Workspace</FormLabel>
            <Input
              sx={{ marginTop: "5px" }}
              value={wspName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWspName(e.target.value)
              }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              editCurrentWorkspace(data);
              await UpdateWorkSpace(wspData?._id, { name: wspData?.name });
              onClose(false);
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

export default EditWorkSpaceName;
