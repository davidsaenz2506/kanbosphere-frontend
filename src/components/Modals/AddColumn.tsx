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
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";

import Select, { SingleValue } from "react-select";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import {
  IChildCompounds,
  IColumnProjection,
  ICompoundProjection,
  ISpreadSheet,
} from "@/domain/entities/spreadsheet.entity";
import { setSpreadColumns } from "@/utilities/spreadsheet/setSpreadColumns";

import { Tooltip } from "@chakra-ui/react";
import { getColor } from "@/utilities/spreadsheet/getTagColor";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";

import { mathematicalEnginedEncapsuled } from "@/libraries/fylent-math-engine/index";
import { indexOf, uniqBy } from "lodash";
import iconsForCols from "@/libraries/fylent-grid-engine/Grid/utils/iconsForCols";

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
  const maxOrderValue: number | undefined =
    currentWorkspace?.currentWorkSpace?.spreadSheetData?.columns.reduce(
      (max, column) => Math.max(max, column.order),
      0
    );
  const performanceWorkspaces = useWorkspace();
  const [columnName, setColumnName] = useState<string | undefined>();
  const [columnType, setColumnType] = useState<string | undefined>();
  const [engineOperation, setEngineOperation] = useState<string | undefined>();
  const [newColumn, setNewColumn] = useState<IColumnProjection>({
    title: "",
    type: "",
    icon: "",
    order: maxOrderValue ? maxOrderValue + 1 : 0,
    width: 100,
  });

  const [userClick, setUserClick] = useState<number>(0);
  const [userTypedValue, setUserTypedValue] = useState<string>("");
  const [engineStatements, setEngineStatements] = useState<any>();
  const [triggerPointer, setTriggerPointer] = useState<number>(0);
  const [columnsSuitableForComposition, setColumnsSuitableForComposition] =
    useState<IPicklistOptions[]>();
  const [currentCompoundColumnValues, setCurrentCompoundColumnValues] =
    useState<ICompoundProjection>();

  const [userPicklistValues, setUserPicklistValues] = useState<
    ISelectColorOptions[]
  >([]);

  const [currentSpreadData, setCurrentSpreadData] = useState<ISpreadSheet>();

  React.useEffect(() => {
    setNewColumn({
      title: columnName ?? "Default",
      type: columnType ?? "string",
      icon: iconsForCols[columnType]?.icon,
      width: 100,
      order: maxOrderValue ? maxOrderValue + 1 : 0,
      picklistValues: userPicklistValues,
      compoundValues: currentCompoundColumnValues,
    });
  }, [
    columnName,
    columnType,
    userClick,
    userPicklistValues,
    currentCompoundColumnValues,
  ]);

  const statusOptions: IPicklistOptions[] = [
    { value: "string", label: "✍ Texto" },
    { value: "number", label: "🔢 Numero" },
    { value: "picklist", label: "🧨 Picklist" },
    { value: "multipicklist", label: "🧮 Multipicklist" },
    { value: "date", label: "📅 Fecha" },
    { value: "time", label: "🕐 Hora" },
    { value: "mail", label: "📩 Correo electronico" },
    { value: "phone", label: "📞 Numero celular" },
    { value: "boolean", label: "📦 Checkbox" },
    { value: "compound", label: "🎨 Compuesta" },
    { value: "calculator", label: "📚 Calculadora" },
  ];

  const mathEngineOperations: IPicklistOptions[] = [
    { value: "financial", label: "💵 Finanzas" },
    { value: "medicine", label: "💉 Salud" },
    { value: "physics", label: "🍎 Fisica" },
  ];

  async function addColumn() {
    const unmodifiedWorkspace: IWspUser | undefined =
      currentWorkspace.currentWorkSpace;

    if (unmodifiedWorkspace) {
      unmodifiedWorkspace.spreadSheetData = currentSpreadData;
      currentWorkspace.setCurrentWorkSpace(unmodifiedWorkspace);
    }

    const currentWorkspaces: IWspUser[] = performanceWorkspaces.userWsps;
    const updatedWorkspaces = currentWorkspaces.map((bookRow: IWspUser) => {
      if (bookRow._id === currentWorkspace?.currentWorkSpace?._id) {
        return currentWorkspace.currentWorkSpace;
      } else return bookRow;
    });

    performanceWorkspaces.setUsersWsps(updatedWorkspaces);

    setColumnType(undefined);
    setEngineOperation(undefined);
    setEngineStatements(undefined);
    setCurrentCompoundColumnValues(undefined);
    setUserPicklistValues([]);
    setIsLoading(false);
    onClose(false);
  }

  React.useEffect(() => {
    if (newColumn.title && newColumn.type) addColumn();
  }, [triggerPointer]);

  React.useEffect(() => {
    if (currentWorkspace.currentWorkSpace?.spreadSheetData) {
      setColumnsSuitableForComposition(
        currentWorkspace?.currentWorkSpace?.spreadSheetData.columns
          .filter((currentProjection) => currentProjection.type === "number")
          .map((currentProjection) => {
            return {
              value: currentProjection.title,
              label: currentProjection.title,
            };
          })
      );
    }
  }, [currentWorkspace.currentWorkSpace]);

  console.log(currentWorkspace.currentWorkSpace);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose(false);
        setColumnType(undefined);
        setEngineOperation(undefined);
        setEngineStatements(undefined);
        setCurrentCompoundColumnValues(undefined);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Añadir Columna</ModalHeader>
        <ModalCloseButton marginTop={"5px"} />
        <ModalBody pb={6}>
          <FormControl>
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
                <FormLabel>Crear tarjetas</FormLabel>
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
                  marginTop: userPicklistValues.length ? "20px" : "0px",
                }}
              >
                {userPicklistValues.map((individualPicklistValue, index) => (
                  <React.Fragment>
                    <Tag
                      size={"lg"}
                      bgColor={individualPicklistValue.color}
                      cursor={"pointer"}
                      marginRight={"5px"}
                      marginBottom={"5px"}
                    >
                      <TagLabel>{individualPicklistValue.label}</TagLabel>
                      <Tooltip
                        label="Click para eliminar"
                        aria-label="A tooltip"
                        placement="right"
                      >
                        <TagCloseButton
                          onClick={() => {
                            const newTags = userPicklistValues;

                            newTags.splice(index, 1);

                            setUserPicklistValues(newTags);

                            setUserClick(
                              Math.floor(Math.random() * (10 - 1) + 1)
                            );
                          }}
                        />
                      </Tooltip>
                    </Tag>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )}

          {columnType === "compound" && (
            <React.Fragment>
              {" "}
              <FormControl mt={4}>
                <FormLabel>
                  Seleccione el tipo de operación que desea realizar
                </FormLabel>
                <Box>
                  <Select
                    options={mathEngineOperations}
                    onChange={(e: SingleValue<IPicklistOptions>) => {
                      if (e) setEngineOperation(e.value);
                    }}
                  />
                </Box>
                <Box mt={4}>
                  <Select
                    isDisabled={engineOperation ? false : true}
                    options={Object.entries(
                      mathematicalEnginedEncapsuled[engineOperation] ?? {}
                    ).map((currentSelection) => {
                      return {
                        label: currentSelection[0],
                        value: currentSelection[0],
                      };
                    })}
                    onChange={(e: SingleValue<IPicklistOptions>) => {
                      if (engineOperation && e) {
                        setEngineStatements(
                          mathematicalEnginedEncapsuled[engineOperation][
                            e.value
                          ]
                        );
                        setCurrentCompoundColumnValues({
                          formulaName:
                            mathematicalEnginedEncapsuled[engineOperation][
                              e.value
                            ].value,
                          compounds: [],
                        });
                      }
                    }}
                  />
                </Box>
                {engineStatements && (
                  <Box mt={4}>
                    <FormLabel>Selecciona las columnas</FormLabel>
                    {Object.entries(engineStatements.requiredValues).map(
                      (currentStatement: any) => {
                        return (
                          <Box marginBottom={"10px"}>
                            <Select
                              options={columnsSuitableForComposition ?? []}
                              placeholder={currentStatement[0]}
                              onChange={(e) => {
                                if (
                                  e &&
                                  typeof currentStatement[1] === "string"
                                ) {
                                  const childCompound: IChildCompounds = {
                                    name: e.value ?? "",
                                    columnValue: currentStatement[1],
                                  };
                                  var propertyAlreadyExistInArray: boolean =
                                    false;
                                  var indexOfDuplicate: number | undefined;

                                  const currentCompounds: IChildCompounds[] =
                                    currentCompoundColumnValues?.compounds ??
                                    [];

                                  currentCompounds.forEach(
                                    (
                                      currentChild: IChildCompounds,
                                      index: number
                                    ) => {
                                      if (
                                        currentChild.columnValue ===
                                        childCompound.columnValue
                                      ) {
                                        propertyAlreadyExistInArray = true;
                                        indexOfDuplicate = index;
                                      }
                                    }
                                  );

                                  if (
                                    propertyAlreadyExistInArray &&
                                    indexOfDuplicate !== undefined
                                  ) {
                                    currentCompounds.splice(
                                      indexOfDuplicate,
                                      1
                                    );
                                    currentCompounds.push(childCompound);
                                  } else {
                                    currentCompounds.push(childCompound);
                                  }

                                  setCurrentCompoundColumnValues({
                                    formulaName:
                                      currentCompoundColumnValues?.formulaName ??
                                      "default",
                                    compounds: currentCompounds,
                                  });
                                }
                              }}
                            />
                          </Box>
                        );
                      }
                    )}
                  </Box>
                )}
              </FormControl>
            </React.Fragment>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={"rgba(33,42,62,1)"}
            _hover={{}}
            color={"white"}
            mr={3}
            onClick={() => {
              setIsLoading(true);
              if (currentWorkspace.currentWorkSpace) {
                setSpreadColumns(
                  currentWorkspace.currentWorkSpace,
                  currentWorkspace.setCurrentWorkSpace,
                  setCurrentSpreadData,
                  newColumn,
                  performanceWorkspaces
                );
              }

              setTriggerPointer(Math.random() * 1000 - 1 + 1);
            }}
          >
            Crear
          </Button>
          <Button
            onClick={() => {
              setUserPicklistValues([]);
              setEngineOperation(undefined);
              setEngineStatements(undefined);
              setCurrentCompoundColumnValues(undefined);
              setColumnType(undefined);
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
