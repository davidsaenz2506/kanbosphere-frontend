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

import Select, { SingleValue } from "react-select";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { ISpreadSheet } from "@/domain/entities/spreadsheet.entity";
import { setSpreadColumns } from "@/utilities/spreadsheet/setSpreadColumns";

export interface IPicklistOptions {
  value: string;
  label: string;
}

const CreateColumn = ({ isOpen, onClose }) => {
  const { currentWorkSpace: data, setCurrentWorkSpace: setUserTasks } =
    useCurrentWorkspace();
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("");
  const [newColumn, setNewColumn] = useState({
    title: "",
    type: "",
    width: 100,
  });

  const [currentSpreadData, setCurrentSpreadData] = useState<ISpreadSheet>({
    columns: [...(data.spreadSheetData?.columns ?? []), newColumn],
    data: data.spreadSheetData?.data ?? [],
    userId: data.spreadSheetData?.userId ?? data.createdById,
  });

  React.useEffect(() => {
    setNewColumn({
      title: columnName,
      type: columnType,
      width: 100,
    });
  }, [columnName, columnType]);

  const statusOptions: IPicklistOptions[] = [
    { value: "string", label: "Texto" },
    { value: "number", label: "Numero" },
    { value: "picklist", label: "Picklist" },
    { value: "multipicklist", label: "Multipicklist" },
    { value: "date", label: "Fecha" },
    { value: "datetime", label: "Fecha y Hora" },
    { value: "article", label: "Articulo" },
    { value: "mail", label: "Correo electronico" },
    { value: "cellphone", label: "Numero celular" },
    { value: "boolean", label: "Checkbox" },
  ];

  async function addColumn() {
    setUserTasks({ ...data, spreadSheetData: currentSpreadData });
    await UpdateWorkSpace(data);
  }

  React.useEffect(() => {
    if (newColumn.title && newColumn.type) addColumn();
  }, [currentSpreadData, data.spreadSheetData?.columns]);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Añadir Columna</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl style={{ marginBottom: "20px" }}>
            <FormLabel>Nombre de la columna</FormLabel>
            <Input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setColumnName(e.target.value)
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Tipo de columna</FormLabel>
            <Select
              options={statusOptions}
              onChange={(e: SingleValue<IPicklistOptions>) => {
                if (e) setColumnType(e.value);
              }}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setSpreadColumns(
                data,
                setUserTasks,
                setCurrentSpreadData,
                newColumn
              );
              onClose(false);
            }}
          >
            Crear
          </Button>
          <Button onClick={() => onClose(false)}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateColumn;
