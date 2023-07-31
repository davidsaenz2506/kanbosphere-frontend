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
  Box,
} from "@chakra-ui/react";

import Select, { SingleValue } from "react-select";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import {
  IColumnProjection,
  ISpreadSheet,
} from "@/domain/entities/spreadsheet.entity";
import { setSpreadColumns } from "@/utilities/spreadsheet/setSpreadColumns";

import { Tooltip } from "@chakra-ui/react";
import { getColor } from "@/utilities/spreadsheet/getTagColor";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";

export interface IPicklistOptions {
  value: string;
  label: string;
}

export interface ISelectColorOptions {
  value: string;
  label: string;
  color?: string;
}

const CreateColumn = ({ isOpen, onClose, setIsLoading }) => {
  const currentWorkspace = useCurrentWorkspace();
  const performanceWorkspaces = useWorkspace();
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("");
  const [newColumn, setNewColumn] = useState<IColumnProjection>({
    title: "",
    type: "",
    width: 100,
  });

  const [userClick, setUserClick] = useState<number>(0);
  const [userTypedValue, setUserTypedValue] = useState<string>("");

  const [userPicklistValues, setUserPicklistValues] = useState<
    ISelectColorOptions[]
  >([]);

  const [currentSpreadData, setCurrentSpreadData] = useState<ISpreadSheet>({
    columns: [
      ...(currentWorkspace?.currentWorkSpace?.spreadSheetData?.columns ?? []),
      newColumn,
    ],
    data: currentWorkspace?.currentWorkSpace?.spreadSheetData?.data ?? [],
    userId: currentWorkspace?.currentWorkSpace?.spreadSheetData?.userId
      ? currentWorkspace?.currentWorkSpace?.createdById
      : "",
  });

  React.useEffect(() => {
    setNewColumn({
      title: columnName,
      type: columnType,
      width: 100,
      picklistValues: userPicklistValues,
    });
  }, [columnName, columnType, userClick, userPicklistValues]);

  const statusOptions: IPicklistOptions[] = [
    { value: "string", label: "Texto" },
    { value: "number", label: "Numero" },
    { value: "picklist", label: "Picklist" },
    { value: "multipicklist", label: "Multipicklist" },
    { value: "date", label: "Fecha" },
    { value: "datetime", label: "Fecha y Hora" },
    { value: "mail", label: "Correo electronico" },
    { value: "cellphone", label: "Numero celular" },
    { value: "boolean", label: "Checkbox" },
  ];

  async function addColumn() {
    const unmodifiedWorkspace: IWspUser | undefined = currentWorkspace.currentWorkSpace;
    console.log(unmodifiedWorkspace)
    if (unmodifiedWorkspace) {
      unmodifiedWorkspace.spreadSheetData = currentSpreadData;
      currentWorkspace.setCurrentWorkSpace(unmodifiedWorkspace);
    }

    await UpdateWorkSpace(currentWorkspace?.currentWorkSpace?._id, {
      ...currentWorkspace.currentWorkSpace,
      spreadSheetData: currentSpreadData,
    });

    const currentWorkspaces: IWspUser[] = performanceWorkspaces.userWsps;
    const updatedWorkspaces = currentWorkspaces.map((bookRow: IWspUser) => {
      if (bookRow._id === currentWorkspace?.currentWorkSpace?._id) {
        return currentWorkspace.currentWorkSpace;
      } else return bookRow;
    });

    performanceWorkspaces.setUsersWsps(updatedWorkspaces);

    setColumnType("");
    setUserPicklistValues([]);
    setIsLoading(false);
    onClose(false);
  }

  React.useEffect(() => {
    if (newColumn.title && newColumn.type) addColumn();
  }, [
    currentSpreadData,
    currentWorkspace?.currentWorkSpace?.spreadSheetData?.columns,
  ]);

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

          {(columnType === "picklist" || columnType === "multipicklist") && (
            <React.Fragment>
              {" "}
              <FormControl mt={4}>
                <FormLabel>Crear valores de picklist</FormLabel>
                <Input
                  type="text"
                  placeholder="Ingresa el valor que deseas agregar a la lista"
                  value={userTypedValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserTypedValue(e.currentTarget.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setUserTypedValue("");
                      setUserPicklistValues([
                        ...userPicklistValues,
                        {
                          value: e.currentTarget.value,
                          label: e.currentTarget.value,
                          color: getColor(),
                        },
                      ]);
                    }
                  }}
                />
              </FormControl>
              <div
                className="miniTargets"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {userPicklistValues.map((individualPicklistValue, index) => (
                  <React.Fragment>
                    <Tooltip
                      label="Click para eliminar"
                      aria-label="A tooltip"
                      placement="right"
                    >
                      <Box
                        style={{
                          marginTop: "20px",
                          backgroundColor: individualPicklistValue.color,
                          padding: "10px",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const newTags = userPicklistValues;

                          newTags.splice(index, 1);

                          setUserPicklistValues(newTags);

                          setUserClick(
                            Math.floor(Math.random() * (10 - 1) + 1)
                          );
                        }}
                      >
                        <p style={{ fontWeight: "bolder" }}>
                          {individualPicklistValue.label}
                        </p>
                      </Box>
                    </Tooltip>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setIsLoading(true);
              setSpreadColumns(
                currentWorkspace.currentWorkSpace,
                currentWorkspace.setCurrentWorkSpace,
                setCurrentSpreadData,
                newColumn,
                performanceWorkspaces
              );
            }}
          >
            Crear
          </Button>
          <Button
            onClick={() => {
              setUserPicklistValues([]);
              onClose(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateColumn;
