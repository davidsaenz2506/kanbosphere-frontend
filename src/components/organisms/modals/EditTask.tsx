import React from "react";
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

import Select from "react-select";

const EditTask = ({ isOpen, onClose, data }) => {
  const statusOptions = [
    { value: "In Proccess", label: "In Proccess" },
    { value: "Finished", label: "Finished" },
    { value: "For Review", label: "For Review" },
    { value: "Blocked", label: "Blocked" },
    { value: "New", label: "New" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar tarea</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Información</FormLabel>
            <Input value={data.info} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={{ value: data.status, label: data.status }}
              options={statusOptions}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Fecha de Inicio</FormLabel>
            <Input type="date" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={() => onClose(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTask;
