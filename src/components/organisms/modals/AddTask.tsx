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

const AddTask = ({ isOpen, onClose }) => {

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
        <ModalHeader>Añadir tarea</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl style={{marginBottom: "20px"}}>
            <FormLabel>Titulo</FormLabel>
            <Input type="text" />
          </FormControl>

          <FormControl>
            <FormLabel>Información</FormLabel>
            <Input type="text" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Status</FormLabel>
            <Select options={statusOptions} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Crear
          </Button>
          <Button onClick={() => onClose(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTask;
