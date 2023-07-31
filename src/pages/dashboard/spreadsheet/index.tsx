import React, { useState } from "react";

import { utils, writeFile } from "xlsx";

import Select, { SingleValue } from "react-select";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDimensions,
  Divider,
  Tooltip,
  Box,
  Icon,
  Text,
  Switch,
  Kbd,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import {
  EditIcon,
  HamburgerIcon,
  RepeatIcon,
  Search2Icon,
  UnlockIcon,
} from "@chakra-ui/icons";

import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  useToast,
  Checkbox,
} from "@chakra-ui/react";

import "@glideapps/glide-data-grid/dist/index.css";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import GridDataEditor from "../../../libraries/spreadsheet/Grid/DataEditor";
import CreateColumn from "../../../components/Modals/AddColumn";

import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";

import { deleteGridRow } from "../../../libraries/spreadsheet/Grid/utils/functions/deleteIndividualGridRows";
import { addGridRow } from "../../../libraries/spreadsheet/Grid/utils/functions/addGridRow";
import Loading from "@/components/Loading";
import initResizer from "@/utilities/resizePage";
import { GetFilteredDataByQuery } from "@/services/spreadsheet/getQueryData";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import styles from "../../../libraries/spreadsheet/styles/spreadsheet.module.css";
import { uniqBy } from "lodash";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { GridSelection, Theme } from "@glideapps/glide-data-grid";
import ResponsiveSliderPanel from "../../../components/GridSlider/ResponsiveSliderPanel";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { useRouter } from "next/router";
import {
  FcAddColumn,
  FcAddRow,
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcClearFilters,
  FcCloseUpMode,
  FcCollaboration,
  FcDataConfiguration,
  FcDataEncryption,
  FcDeleteColumn,
  FcDeleteRow,
  FcDocument,
  FcExport,
  FcFilledFilter,
  FcPieChart,
  FcSynchronize,
} from "react-icons/fc";

import { SiMicrosoftexcel } from "react-icons/si";
import { IoPieChartSharp } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import { BsFiletypeJson } from "react-icons/bs";

import { TbMathFunction } from "react-icons/tb";

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
  const [optionsVector, setOptionsVector] = useState<any>([]);
  const currentWorkSpace: ICurrentWspContext = useCurrentWorkspace();
  const [freezeColumns, setFreezeColums] = useState(0);
  const [isDescendingActive, setIsDescendingActive] = useState(true);
  const [internalTriggerPointer, setInternalTriggerPointer] = useState(0);
  const [isNightThemeActive, setIsNightThemeActive] = useState<boolean>(false);
  const [isMenuGridOpen, setIsMenuGridOpen] = useState<boolean>(false);
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
  const [currentWindowSize, setCurrentWindowSize] = useState<
    number | undefined
  >(0);
  const [currentRowsSelected, setCurrentRowsSelected] = useState<number[]>([]);
  const [typedQueryFromUser, setTypeQueryFromUser] = useState({
    workspaceID: "",
    query: "",
  });

  const [useCurrentTheme, setUseCurrentTheme] = useState<Partial<Theme>>({});
  const [gridColumns, setGridColumns] = useState<
    IColumnProjection[] | undefined
  >([]);

  const router = useRouter();

  const isBrowser = () => typeof window !== "undefined";

  const restrictedColumnsToQuery =
    currentWorkSpace.currentWorkSpace?.spreadSheetData?.columns.filter(
      (useColumn) => {
        if (useColumn.type === "string") return true;
        if (useColumn.type === "number") return true;
        if (useColumn.type === "date") return true;
        if (useColumn.type === "datetime") return true;
        if (useColumn.type === "cellphone") return true;
        if (useColumn.type === "mail") return true;
        if (useColumn.type === "boolean") return true;
      }
    );

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

      setCurrentWindowSize(todoDocument?.getBoundingClientRect()?.width);

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
    const queryDataFromMongo = await GetFilteredDataByQuery(
      typedQueryFromUser,
      currentSession.currentUser.userID
    );

    if (queryDataFromMongo) setSpreadSheetData(queryDataFromMongo);
    else
      setSpreadSheetData(
        currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
      );
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

  function sortRowsBySelection(spreadSheetData) {
    const currentUnsortedSpreadData = spreadSheetData;

    if (selectedColumnToSort.length === 0) {
      setSpreadSheetData(
        currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
      );
      return;
    }

    if (
      selectedColumnToSort[selectedColumnToSort?.length - 1].type === "number"
    ) {
      if (isDescendingActive) {
        currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
          return (
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
            ] -
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
            ]
          );
        });
      } else {
        currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
          return (
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
            ] -
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1]?.value
            ]
          );
        });
      }
    }

    if (
      selectedColumnToSort[selectedColumnToSort?.length - 1].type === "boolean"
    ) {
      if (isDescendingActive) {
        currentUnsortedSpreadData.sort(function (beforeIndex, currentIndex) {
          return beforeIndex[
            selectedColumnToSort[selectedColumnToSort?.length - 1].value
          ] ===
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
            ? 0
            : beforeIndex[
                selectedColumnToSort[selectedColumnToSort?.length - 1].value
              ]
            ? -1
            : 1;
        });
      } else {
        currentUnsortedSpreadData.sort(function (beforeIndex, currentIndex) {
          return beforeIndex[
            selectedColumnToSort[selectedColumnToSort?.length - 1].value
          ] ===
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
            ? 0
            : beforeIndex[
                selectedColumnToSort[selectedColumnToSort?.length - 1].value
              ]
            ? 1
            : -1;
        });
      }
    }

    if (
      selectedColumnToSort[selectedColumnToSort?.length - 1].type === "string"
    ) {
      if (isDescendingActive) {
        currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
          if (
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ] <
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
          ) {
            return -1;
          }
          if (
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ] >
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
          ) {
            return 1;
          }
          return 0;
        });
      } else {
        currentUnsortedSpreadData?.sort((beforeIndex, currentIndex) => {
          if (
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ] >
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
          ) {
            return -1;
          }
          if (
            beforeIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ] <
            currentIndex[
              selectedColumnToSort[selectedColumnToSort?.length - 1].value
            ]
          ) {
            return 1;
          }
          return 0;
        });
      }
    }

    setSpreadSheetData(currentUnsortedSpreadData);
  }

  React.useEffect(() => {
    const InitialTodoDocument: HTMLDivElement | null =
      document.querySelector(".todoContainer");

    setCurrentWindowSize(InitialTodoDocument?.getBoundingClientRect()?.width);
    setSpreadSheetData(
      currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
    );
  }, []);

  React.useEffect(() => {
    setSpreadSheetData(
      currentWorkSpace?.currentWorkSpace?.spreadSheetData?.data
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
    setGridColumns(
      currentWorkSpace?.currentWorkSpace?.spreadSheetData?.columns
    );
    if (gridColumns?.length) {
      setOptionsVector(
        gridColumns.map((value: IColumnProjection, index: number) => {
          return {
            value: index + 1,
            label: index + 1,
          };
        })
      );
    }
  }, [gridColumns]);

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
      <Drawer
        isOpen={isMenuGridOpen}
        placement="right"
        onClose={() => setIsMenuGridOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Opciones de cuadrícula</DrawerHeader>

          <DrawerBody>
            <ResponsiveSliderPanel
              setTypeQueryFromUser={setTypeQueryFromUser}
              currentWorkSpace={currentWorkSpace}
              keyCodeFromEnterDown={keyCodeFromEnterDown}
              handleUserQuery={handleUserQuery}
              setAddTask={setAddTask}
              currentRowsSelected={currentRowsSelected}
              toastNotification={toastNotification}
              exportToExcel={exportToExcel}
              setOpenSlider={setOpenSlider}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setIsMenuGridOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setInternalTriggerPointer(Math.random() * 1000 - 1 + 1);
                sortRowsBySelection(spreadSheetData);
                setIsMenuGridOpen(false);
              }}
              colorScheme="blue"
            >
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={openSlider}
        placement="right"
        onClose={() => setOpenSlider(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ordenar por columna</DrawerHeader>

          <DrawerBody>
            <Select
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
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Input
                      value={uniqResort.label}
                      style={{ marginTop: "60px" }}
                      size="lg"
                    />
                    <Checkbox
                      sx={{ marginTop: "15px", marginLeft: "10px" }}
                      isChecked={isDescendingActive}
                      onChange={() => {
                        setIsDescendingActive(!isDescendingActive);
                        sortRowsBySelection(spreadSheetData);
                      }}
                    >
                      Orden descendiente
                    </Checkbox>
                    <Button
                      sx={{ marginTop: "20px" }}
                      onClick={() => {
                        setSelectedColumnToSort([]);
                      }}
                      colorScheme="red"
                    >
                      Limpiar filtro
                    </Button>
                  </div>
                );
            })}

            <Divider style={{ marginTop: "40px" }} />

            <div style={{ marginTop: "30px" }}>
              <h4 style={{ marginBottom: "20px" }}>Congelar columnas</h4>
              <Select
                options={optionsVector ?? []}
                value={freezeColumns}
                onChange={(e: any) => {
                  if (e) {
                    if (e.value) setFreezeColums(e);
                  }
                }}
                placeholder="Congelar columnas"
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              <h4 style={{ marginBottom: "20px" }}>Modo oscuro</h4>
              <Checkbox
                defaultChecked={isNightThemeActive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIsNightThemeActive(e.target.checked);
                  if (e.target.checked) {
                    setUseCurrentTheme({
                      accentColor: "#8c96ff",
                      accentLight: "rgba(202, 206, 255, 0.253)",

                      textDark: "#ffffff",
                      textMedium: "#b8b8b8",
                      textLight: "#a0a0a0",
                      textBubble: "#ffffff",

                      bgIconHeader: "#b8b8b8",
                      fgIconHeader: "#000000",
                      textHeader: "#a1a1a1",
                      textHeaderSelected: "#000000",

                      bgCell: "#16161b",
                      bgCellMedium: "#202027",
                      bgHeader: "#212121",
                      bgHeaderHasFocus: "#474747",
                      bgHeaderHovered: "#404040",

                      bgBubble: "#212121",
                      bgBubbleSelected: "#000000",

                      bgSearchResult: "#423c24",

                      borderColor: "rgba(225,225,225,0.2)",
                      drilldownBorder: "rgba(225,225,225,0.4)",

                      linkColor: "#4F5DFF",

                      headerFontStyle: "bold 14px",
                      baseFontStyle: "13px",
                      fontFamily:
                        "Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif",
                    });
                  } else setUseCurrentTheme({});
                }}
              >
                Activar modo oscuro
              </Checkbox>
            </div>
          </DrawerBody>

          <Divider style={{ marginTop: "40px" }} />

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setOpenSlider(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setInternalTriggerPointer(Math.random() * 1000 - 1 + 1);
                sortRowsBySelection(spreadSheetData);
                setOpenSlider(false);
              }}
              colorScheme="blue"
            >
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
                  <Search2Icon w={3} h={3} marginBottom={"10px"} />
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
                <Button
                  borderRight={"1px solid #dddddd"}
                  borderLeft={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() => {
                    setAddTask(true);
                  }}
                >
                  <Icon as={FcAlphabeticalSortingAz} />
                </Button>

                <Button
                  borderRight={"1px solid #dddddd"}
                  height={"30px"}
                  borderRadius={"0px"}
                  onClick={() => addGridRow(currentWorkSpace)}
                >
                  <Icon as={FcAlphabeticalSortingZa} />
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
                  <Icon as={FcDataEncryption} />
                </Button>

                <Box
                  display={"flex"}
                  alignItems={"center"}
                  paddingLeft={"20px"}
                >
                  <Switch size="sm" colorScheme="gray" />
                  <Text fontSize={"14px"} marginLeft={"15px"}>
                    Modo oscuro
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
                onClick={() => exportToExcel()}
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
                isDisabled={currentRowsSelected !== undefined ? false : true}
              >
                <Icon as={FcDeleteRow} />
              </Button>

              <Button
                borderRadius={"0px"}
                height={"30px"}
                borderRight={"1px solid #dddddd"}
                onClick={() => {
                  setOpenSlider(true);
                }}
              >
                <Icon as={FcDataConfiguration} />
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
                      //@ts-ignore
                      currentWorkSpace?.currentWorkSpace
                    );

                    setIsLoading(false);
                    toastNotification({
                      title: "Correcto",
                      description:
                        "¡Datos sincronizados con éxito!",
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    });
                  }, 1000);
                }}
              >
                <Icon
                  className={isLoading ? styles.syncIcon : "staticIcon"}
                  as={FcSynchronize}
                />
              </Button>

              <Box display={"flex"} alignItems={"center"} paddingLeft={"20px"}>
                <Switch size="sm" colorScheme="green" />
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
                  onClick={() =>
                    deleteGridRow(
                      currentRowsSelected,
                      currentWorkSpace,
                      toastNotification
                    )
                  }
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
          useTheme={useCurrentTheme}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;
