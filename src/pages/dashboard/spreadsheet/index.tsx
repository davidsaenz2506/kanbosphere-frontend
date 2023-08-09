import React, { useState } from "react";

import { utils, writeFile } from "xlsx";

import Select from "react-select";
import chroma from "chroma-js";

import {
  Box,
  Icon,
  Text,
  Switch,
  Badge,
  Grid,
  GridItem,
  Spinner,
  InputLeftElement,
} from "@chakra-ui/react";

import { Search2Icon } from "@chakra-ui/icons";

import {
  Button,
  Input,
  InputGroup,
  useToast,
  Checkbox,
} from "@chakra-ui/react";

import "@glideapps/glide-data-grid/dist/index.css";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import GridDataEditor from "@/libraries/fylent-grid-engine/Grid/DataEditor";
import CreateColumn from "../../../components/Modals/AddColumn";

import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";

import { deleteGridRow } from "@/libraries/fylent-grid-engine/Grid/utils/functions/deleteIndividualGridRows";
import { addGridRow } from "@/libraries/fylent-grid-engine/Grid/utils/functions/addGridRow";
import { GetFilteredDataByQuery } from "@/services/spreadsheet/getQueryData";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import styles from "@/libraries/fylent-grid-engine/styles/spreadsheet.module.css";
import { uniqBy } from "lodash";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { GridSelection, Theme } from "@glideapps/glide-data-grid";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { useRouter } from "next/router";
import {
  FcAddColumn,
  FcAddRow,
  FcAlphabeticalSortingAz,
  FcClearFilters,
  FcCloseUpMode,
  FcCollaboration,
  FcDataEncryption,
  FcDeleteColumn,
  FcDeleteRow,
  FcFilledFilter,
  FcSynchronize,
} from "react-icons/fc";

import { SiMicrosoftexcel } from "react-icons/si";
import { IoPieChartSharp } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import { BsFiletypeJson } from "react-icons/bs";

import { TbMathFunction } from "react-icons/tb";
import { sendNewColumnsToServer } from "@/libraries/fylent-grid-engine/Grid/utils/functions/sendColumnsToServet";
import PopoverComponent from "@/components/Popover/General";
import currentBiridectionalCommunication from "@/services/socket";
import { sortRowsBySelection } from "@/utilities/sortColumns";

interface ISpreadGrid {
  wch: number;
}

interface ISortColumn {
  value: string;
  label: string;
  type: string;
}

const Spreadsheet = () => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const currentSession = useCurrentUser();
  const { currentWorkSpace: data, setCurrentWorkSpace: setData } =
    useCurrentWorkspace();
  const generalWorkspaceData = useWorkspace();
  const keyCodeFromEnterDown = 13;
  const [isSendingQuery, setIsSendingQuery] = useState<boolean>(false);
  const currentWorkSpace: ICurrentWspContext = useCurrentWorkspace();
  const [freezeColumns, setFreezeColums] = useState(0);
  const [isDescendingActive, setIsDescendingActive] = useState(true);
  const [internalTriggerPointer, setInternalTriggerPointer] = useState(0);
  const [isMultipleSelectionActive, setIsMultipleSelectionActive] =
    useState<boolean>();
  const [isRowSelectionActive, setIsRowSelectionActive] = useState<boolean>();
  const [currentSelection, setCurrentSelection] = useState<GridSelection>();
  const [selectedColumnToSort, setSelectedColumnToSort] = useState<
    ISortColumn[]
  >([]);
  const todoRefHTMLElement = React.createRef<HTMLElement>();
  const [openSlider, setOpenSlider] = useState(false);
  const [spreadSheetData, setSpreadSheetData] = useState(
    currentWorkSpace.currentWorkSpace?.spreadSheetData?.data
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentRowsSelected, setCurrentRowsSelected] = useState<number[]>([]);
  const [typedQueryFromUser, setTypeQueryFromUser] = useState({
    workspaceID: "",
    query: "",
  });

  const [spreadColumns, setSpreadColumns] = useState<IColumnProjection[]>([]);

  const router = useRouter();

  const isBrowser = () => typeof window !== "undefined";

  const restrictedColumnsToQuery = spreadColumns.filter((useColumn) => {
    if (useColumn.type === "string") return true;
    if (useColumn.type === "number") return true;
    if (useColumn.type === "date") return true;
    if (useColumn.type === "boolean") return true;
  });

  const toastNotification = useToast();

  if (isBrowser()) {
    window.onresize = function onResize() {
      const todoDocument: HTMLDivElement | null =
        document.querySelector(".todoContainer");
      const navBarDocument: any = document.getElementById("navbarHome");
      const bodyDocumentData: HTMLBodyElement | null =
        document.querySelector("body");

      const workSpaceContainer = document.getElementById("workSpace");

      const resizetToolData: HTMLElement | null =
        document.getElementById("resizerTool");

      if (
        todoDocument &&
        bodyDocument &&
        bodyDocumentData &&
        resizetToolData &&
        workSpaceContainer
      ) {
        todoDocument.style.height = `${
          bodyDocument.getBoundingClientRect().height -
          navBarDocument.getBoundingClientRect().height
        }px`;

        workSpaceContainer.style.width = "100%";
      }
    };
  }

  async function handleUserQuery() {
    setIsSendingQuery(true);
    const queryDataFromMongo = await GetFilteredDataByQuery(
      typedQueryFromUser,
      currentSession.currentUser.userID
    );

    if (queryDataFromMongo) setSpreadSheetData(queryDataFromMongo);
    else
      setSpreadSheetData(
        currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
      );

    setIsSendingQuery(false);
  }

  function exportToExcel() {
    var workBook = utils.book_new();
    var workSheet = utils.json_to_sheet(
      currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data ?? []
    );

    var widthColumnsForGrid: ISpreadGrid[] = [];
    var objectWithProperties: object = {};

    const newComputedColumnsForSheet =
      currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data.map(
        (currentRow) => {
          const lengthValues = Object.values(currentRow);
          const numberValues: number[] = [];

          lengthValues.forEach((individualStringBook: any) =>
            numberValues.push(String(individualStringBook).length)
          );
          return numberValues;
        }
      );

    newComputedColumnsForSheet?.forEach((item) => {
      for (let currentVectorValue in item) {
        if (!objectWithProperties.hasOwnProperty(currentVectorValue)) {
          objectWithProperties[currentVectorValue] = [];
        }
        objectWithProperties[currentVectorValue].push(item[currentVectorValue]);
      }
    });

    const propertiesToArrayFromExcel = Object.entries(objectWithProperties);

    propertiesToArrayFromExcel.forEach((individualVector) => {
      widthColumnsForGrid.push({
        wch: Math.max(...individualVector[1]),
      });
    });

    utils.book_append_sheet(workBook, workSheet, "userSheets");
    workSheet["!cols"] = widthColumnsForGrid;

    writeFile(workBook, `${currentWorkSpace?.currentWorkSpace?.name}.xlsx`, {
      compression: true,
    });
  }

  React.useEffect(() => {
    if (
      currentWorkSpace.currentWorkSpace &&
      currentWorkSpace.currentWorkSpace.spreadSheetData
    ) {
      setSpreadSheetData(
        currentWorkSpace.currentWorkSpace.spreadSheetData.data
      );
      setSpreadColumns(
        currentWorkSpace.currentWorkSpace.spreadSheetData.columns
      );
    }
  }, []);

  React.useEffect(() => {
    if (
      currentWorkSpace.currentWorkSpace &&
      currentWorkSpace.currentWorkSpace.spreadSheetData
    ) {
      setSpreadSheetData(
        currentWorkSpace.currentWorkSpace.spreadSheetData.data
      );
      setSpreadColumns(
        currentWorkSpace.currentWorkSpace.spreadSheetData.columns
      );
    }

    setIsMultipleSelectionActive(
      currentWorkSpace?.currentWorkSpace?.wspDataPreferences[
        "isMultipleSelectionActive"
      ]
    );
    setIsRowSelectionActive(
      currentWorkSpace?.currentWorkSpace?.wspDataPreferences[
        "isRowSelectionActive"
      ]
    );
  }, [currentWorkSpace.currentWorkSpace?.spreadSheetData?.data]);

  React.useEffect(() => {
    const InitialTodoDocument: HTMLDivElement | null =
      document.querySelector(".todoContainer");
    const InitialNavBarDocument: any = document.getElementById("navbarHome");

    if (InitialTodoDocument && bodyDocument) {
      InitialTodoDocument.style.height = `${
        bodyDocument.getBoundingClientRect().height -
        InitialNavBarDocument.getBoundingClientRect().height
      }px`;
    }
  });

  React.useEffect(() => {
    const currentWorkSpace: IWspUser | undefined =
      generalWorkspaceData.userWsps.find(
        (currentWsp) => currentWsp?._id === data?._id
      );
    setData(currentWorkSpace);
  }, [generalWorkspaceData.userWsps]);

  React.useEffect(() => {
    const { setCurrentWorkSpace } = currentWorkSpace;
    const relatedWorkspace: IWspUser[] = generalWorkspaceData.userWsps.filter(
      (currentRecord: IWspUser) => currentRecord._id === router.query?.fridgeKey
    );
    setCurrentWorkSpace(relatedWorkspace[0]);
  }, [router.query?.fridgeKey]);

  return (
    <div
      className="todoContainer"
      ref={todoRefHTMLElement as React.RefObject<HTMLDivElement>}
      style={{
        width: "100%",
        background: "#edf2f7",
      }}
    >
      <CreateColumn
        isOpen={addTask}
        onClose={setAddTask}
        setIsLoading={setIsLoading}
      />
      <Box className={styles.toolbarsect}>
        <Grid
          height={"100%"}
          width={"100%"}
          templateRows="repeat(2)"
          templateColumns="repeat(2, 50%)"
          padding={"5px 5px 0 5px"}
          gap={0}
        >
          <GridItem
            paddingBottom={"5px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box style={{ width: "100%" }}>
              <InputGroup display={"flex"} alignItems={"center"}>
                <InputLeftElement>
                  <Icon
                    as={isSendingQuery ? Spinner : Search2Icon}
                    w={3}
                    h={3}
                    marginBottom={"10px"}
                  />
                </InputLeftElement>
                <Input
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    height: "30px",
                    fontSize: "14px",
                  }}
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTypeQueryFromUser({
                      workspaceID:
                        currentWorkSpace?.currentWorkSpace?._id ?? "",
                      query: e.currentTarget.value,
                    })
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.keyCode === keyCodeFromEnterDown) handleUserQuery();
                  }}
                  placeholder="Filtra tus datos aquí"
                />
              </InputGroup>
            </Box>
          </GridItem>
          <GridItem paddingLeft={"10px"} display={"flex"} alignItems={"center"}>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box display={"flex"}>
                <PopoverComponent
                  clickAwayClosesModal={false}
                  content={
                    <Box overflowY={"hidden"} padding={"10px 20px 20px 20px"}>
                      <Text marginBottom={"10px"}>Ordernar</Text>
                      <Select
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
                        }}
                        options={
                          restrictedColumnsToQuery?.map((userColumn) => {
                            return {
                              value: userColumn.title,
                              type: userColumn.type,
                              label: userColumn.title,
                            };
                          }) ?? []
                        }
                        onChange={(e: any) => {
                          if (e) {
                            if (e.value && selectedColumnToSort.length <= 2)
                              setSelectedColumnToSort(uniqBy([e], "label"));
                          }
                        }}
                        placeholder="Seleccione una columna"
                      />

                      {selectedColumnToSort.map((uniqResort, index) => {
                        if (index == selectedColumnToSort.length - 1)
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Input
                                value={uniqResort.label}
                                style={{ marginTop: "20px" }}
                                size="md"
                              />
                              <Checkbox
                                sx={{ marginTop: "15px", marginLeft: "5px" }}
                                colorScheme="purple"
                                isChecked={isDescendingActive}
                                onChange={() => {
                                  setIsDescendingActive(!isDescendingActive);
                                  if (spreadSheetData) {
                                    sortRowsBySelection(
                                      spreadSheetData,
                                      setSpreadSheetData,
                                      selectedColumnToSort,
                                      isDescendingActive,
                                      currentWorkSpace
                                    );
                                  }
                                }}
                              >
                                Orden descendiente
                              </Checkbox>

                              <Button
                                sx={{ marginTop: "20px" }}
                                onClick={() => {
                                  setInternalTriggerPointer(
                                    Math.random() * 1000 - 1 + 1
                                  );
                                  if (spreadSheetData) {
                                    sortRowsBySelection(
                                      spreadSheetData,
                                      setSpreadSheetData,
                                      selectedColumnToSort,
                                      isDescendingActive,
                                      currentWorkSpace
                                    );
                                  }
                                }}
                                bgColor={"rgba(33,42,62,1)"}
                                color={"white"}
                                _hover={{}}
                              >
                                Ordenar
                              </Button>
                            </div>
                          );
                      })}
                    </Box>
                  }
                  trigger={
                    <Button
                      borderRight={"1px solid #dddddd"}
                      borderLeft={"1px solid #dddddd"}
                      height={"30px"}
                      borderRadius={"0px"}
                    >
                      <Icon as={FcAlphabeticalSortingAz} />
                    </Button>
                  }
                />

                <Button
                  borderRight={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() =>
                    deleteGridRow(
                      currentRowsSelected,
                      currentWorkSpace,
                      toastNotification
                    )
                  }
                  isDisabled={currentRowsSelected !== undefined ? false : true}
                >
                  <Icon as={FcFilledFilter} />
                </Button>

                <Button
                  borderRadius={"0px"}
                  height={"30px"}
                  borderRight={"1px solid #dddddd"}
                  onClick={() => exportToExcel()}
                >
                  <Icon as={FcClearFilters} />
                </Button>

                <Button
                  borderRadius={"0px"}
                  height={"30px"}
                  borderRight={"1px solid #dddddd"}
                  onClick={() => {
                    setOpenSlider(true);
                  }}
                >
                  <Icon as={FcCollaboration} />
                </Button>

                <PopoverComponent
                  content={
                    <Box
                      minW={"300px"}
                      overflowY={"hidden"}
                      padding={"10px 20px 20px 20px"}
                    >
                      <Text marginBottom={"5px"}>Congelar columnas</Text>
                      <Select
                        options={
                          spreadColumns.map(
                            (value: IColumnProjection, index: number) => {
                              return {
                                value: index + 1,
                                label: index + 1,
                              };
                            }
                          ) ?? []
                        }
                        value={freezeColumns}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
                          option: (
                            styles,
                            { data, isDisabled, isFocused, isSelected }
                          ) => {
                            const color = chroma("rgba(33,42,62,1)");
                            return {
                              ...styles,
                              backgroundColor: isDisabled
                                ? undefined
                                : isSelected
                                ? "rgba(33,42,62,1)"
                                : isFocused
                                ? color.alpha(0.2).css()
                                : undefined,
                            };
                          },
                        }}
                        onChange={(e: any) => {
                          if (e) {
                            if (e.value) setFreezeColums(e);
                          }
                        }}
                        placeholder="Congelar columnas"
                      />
                    </Box>
                  }
                  trigger={
                    <Button
                      borderRight={"1px solid #dddddd"}
                      height={"30px"}
                      borderRadius={"0px"}
                    >
                      <Icon as={FcDataEncryption} />
                    </Button>
                  }
                />

                <Button
                  borderRight={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={async () => {
                    setIsLoading(true);
                    await UpdateWorkSpace(
                      currentWorkSpace?.currentWorkSpace?._id,
                      //@ts-ignore
                      currentWorkSpace?.currentWorkSpace
                    );

                    setIsLoading(false);
                    toastNotification({
                      title: "Correcto",
                      description:
                        "¡Sus datos se han guardado con éxito en la base de datos de Tumble!",
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    });
                  }}
                >
                  <Icon as={FcCloseUpMode} />
                </Button>

                <Box
                  display={"flex"}
                  alignItems={"center"}
                  paddingLeft={"20px"}
                >
                  <Switch
                    isChecked={isRowSelectionActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsRowSelectionActive(e.target.checked);
                      if (currentWorkSpace.currentWorkSpace) {
                        const workspaceToModify: IWspUser =
                          currentWorkSpace.currentWorkSpace;
                        workspaceToModify.wspDataPreferences[
                          "isRowSelectionActive"
                        ] = e.target.checked;
                        currentWorkSpace.setCurrentWorkSpace(workspaceToModify);
                      }
                    }}
                    size="sm"
                    colorScheme="gray"
                  />
                  <Text fontSize={"14px"} marginLeft={"15px"}>
                    Selección de fila
                  </Text>
                </Box>
              </Box>

              <Box display={"flex"} alignItems={"center"} marginRight={"10px"}>
                <Badge colorScheme="purple">
                  {
                    currentWorkSpace.currentWorkSpace?.spreadSheetData?.data
                      .length
                  }{" "}
                  rows{" "}
                </Badge>
                <Badge marginLeft={"5px"} colorScheme="orange">
                  {
                    currentWorkSpace.currentWorkSpace?.spreadSheetData?.columns
                      .length
                  }{" "}
                  columns{" "}
                </Badge>
              </Box>
            </Box>
          </GridItem>
          <GridItem
            display={"flex"}
            borderTop={"3px solid #A0A0B8"}
            alignItems={"center"}
            paddingLeft={"5px"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Box display={"flex"} flexDir={"column"} paddingRight={"20px"}>
                <Badge colorScheme="green">Botones de acceso rápido</Badge>
              </Box>
              <Button
                borderRight={"1px solid #dddddd"}
                borderLeft={"1px solid #dddddd"}
                height={"30px"}
                borderRadius={"0px"}
                onClick={() => {
                  setAddTask(true);
                }}
              >
                <Icon as={FcAddColumn} />
              </Button>

              <Button
                borderRight={"1px solid #dddddd"}
                height={"30px"}
                borderRadius={"0px"}
                onClick={() => addGridRow(currentWorkSpace)}
              >
                <Icon as={FcAddRow} />
              </Button>

              <Button
                borderRadius={"0px"}
                height={"30px"}
                borderRight={"1px solid #dddddd"}
                isDisabled={
                  currentSelection?.columns["items"].length ? false : true
                }
                onClick={() => {
                  const currentColumns: IColumnProjection[] =
                    currentWorkSpace.currentWorkSpace?.spreadSheetData
                      ?.columns ?? [];
                  const currentColumnSelected =
                    currentSelection?.columns["items"][0][0];
                  const modifiedWorkspaceTarget: Partial<IWspUser> =
                    currentWorkSpace.currentWorkSpace ?? {};
                  currentColumns.splice(currentColumnSelected, 1);
                  modifiedWorkspaceTarget.spreadSheetData =
                    currentWorkSpace.currentWorkSpace?.spreadSheetData;

                  sendNewColumnsToServer(
                    currentWorkSpace,
                    currentSession,
                    currentColumns,
                    spreadSheetData
                  );

                  setInternalTriggerPointer(Math.random() * 1000 - 1 + 1);
                  setIsLoading(false);
                }}
              >
                <Icon as={FcDeleteColumn} />
              </Button>

              <Button
                borderRight={"1px solid #dddddd"}
                height={"30px"}
                borderRadius={"0px"}
                onClick={() =>
                  deleteGridRow(
                    currentRowsSelected,
                    currentWorkSpace,
                    toastNotification
                  )
                }
                isDisabled={
                  isRowSelectionActive
                    ? currentSelection?.rows["items"].length
                      ? false
                      : true
                    : true
                }
              >
                <Icon as={FcDeleteRow} />
              </Button>

              <Button
                className={styles.syncButton}
                borderRadius={"0px"}
                height={"30px"}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(async () => {
                    await UpdateWorkSpace(
                      currentWorkSpace?.currentWorkSpace?._id,
                      {
                        body: currentWorkSpace.currentWorkSpace ?? {},
                        transactionObject: {
                          currentUserSocketId:
                            currentBiridectionalCommunication.id,
                          currentRoomToken: {
                            roomToken:
                              currentWorkSpace.currentWorkSpace?._id ?? "",
                          },
                        },
                      }
                    );

                    setIsLoading(false);
                    toastNotification({
                      title: "Correcto",
                      description: "¡Datos sincronizados con éxito!",
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    });
                  }, 1000);
                }}
              >
                <Icon
                  className={isLoading ? styles.syncIcon : "staticIcon"}
                  transform={"rotate(45deg)"}
                  as={FcSynchronize}
                />
              </Button>

              <Box display={"flex"} alignItems={"center"} paddingLeft={"20px"}>
                <Switch
                  isChecked={isMultipleSelectionActive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setIsMultipleSelectionActive(e.target.checked);
                    if (currentWorkSpace.currentWorkSpace) {
                      const workspaceToModify: IWspUser =
                        currentWorkSpace.currentWorkSpace;
                      workspaceToModify.wspDataPreferences[
                        "isMultipleSelectionActive"
                      ] = e.target.checked;
                      currentWorkSpace.setCurrentWorkSpace(workspaceToModify);
                    }
                  }}
                  size="sm"
                  colorScheme="green"
                />
                <Text fontSize={"14px"} marginLeft={"15px"}>
                  Selección multiple
                </Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem display={"flex"} paddingLeft={"10px"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              borderTop={"3px solid #A0A0B8"}
              width={"100%"}
            >
              <Box display={"flex"} alignItems={"center"}>
                <Box display={"flex"} flexDir={"column"} paddingRight={"20px"}>
                  <Badge colorScheme="red">
                    {currentWorkSpace.currentWorkSpace?.name}{" "}
                  </Badge>
                </Box>
                <Button
                  borderRight={"1px solid #dddddd"}
                  borderLeft={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() => {
                    setAddTask(true);
                  }}
                >
                  <Icon as={IoPieChartSharp} />
                </Button>

                <Button
                  borderRight={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() => addGridRow(currentWorkSpace)}
                >
                  <Icon as={GrDocumentPdf} />
                </Button>

                <Button
                  borderRight={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() => exportToExcel()}
                  isDisabled={currentRowsSelected !== undefined ? false : true}
                >
                  <Icon as={SiMicrosoftexcel} />
                </Button>

                <Button
                  borderRadius={"0px"}
                  height={"30px"}
                  borderRight={"1px solid #dddddd"}
                  onClick={() => exportToExcel()}
                >
                  <Icon as={BsFiletypeJson} />
                </Button>

                <Button
                  borderRadius={"0px"}
                  height={"30px"}
                  borderRight={"1px solid #dddddd"}
                  onClick={() => {
                    setOpenSlider(true);
                  }}
                >
                  <Icon as={TbMathFunction} />
                </Button>

                <Box
                  display={"flex"}
                  alignItems={"center"}
                  paddingLeft={"20px"}
                >
                  <Switch size="sm" colorScheme="facebook" isChecked={false} />
                  <Text fontSize={"14px"} marginLeft={"15px"}>
                    Autoguardado
                  </Text>
                </Box>
              </Box>
              {currentSelection?.current?.cell[0] !== undefined && (
                <Box display={"flex"} flexDir={"row"} paddingRight={"10px"}>
                  <Badge
                    marginLeft={"5px"}
                    marginRight={"5px"}
                    colorScheme="pink"
                  >
                    Columna {currentSelection?.current?.cell[0]}
                  </Badge>
                  <Badge colorScheme="teal">
                    Fila {currentSelection?.current?.cell[1]}{" "}
                  </Badge>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
      <div className={styles.GridContainer}>
        <GridDataEditor
          data={spreadSheetData ?? []}
          internalTriggerPointer={internalTriggerPointer}
          setCurrentRowsSelected={setCurrentRowsSelected}
          setCurrentSelection={setCurrentSelection}
          freezeColumns={freezeColumns}
          useTheme={{}}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;
