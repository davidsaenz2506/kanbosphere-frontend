import React from "react";

import emptyBoxPath from "../../../public/assets/EmptyBox.jpg";
import {
  Badge,
  Box,
  Icon,
  IconButton,
  Image,
  Progress,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { IDataToDo, IFilePath } from "@/domain/entities/todo.entity";
import { SearchIcon } from "@chakra-ui/icons";

import {
  getIconValueForPriority,
  getIconValueForStatus,
} from "@/utilities/icons";
import { formatDate } from "@/utilities/date/format";

import { TbCalendarBolt, TbCalendarOff } from "react-icons/tb";
import { FcServices, FcDeleteDatabase, FcComboChart } from "react-icons/fc";
import { AiOutlineClockCircle } from "react-icons/ai";
import { TbClockRecord } from "react-icons/tb";
import QuillEditor from "../RichText.tsx";

interface ISlideTaskProps {
  isOpenSliderTask: boolean;
  selectedTask: IDataToDo | undefined;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  statusColorValues: any;
  isGettingImage: boolean;
  stringPathToRender: IFilePath[];
}

export const getSchemeByValue = (value: number, totalExpected: number) => {
  const currentPercentage: number = (value / totalExpected) * 100;

  switch (true) {
    case currentPercentage >= 0 && currentPercentage <= 35:
      return "red";
    case currentPercentage > 35 && currentPercentage <= 70:
      return "yellow";
    case currentPercentage > 70 && currentPercentage <= 100:
      return "green";
    default:
      return "blue";
  }
};

const SlideTask: React.FC<ISlideTaskProps> = (props) => {
  const {
    isOpenSliderTask,
    selectedTask,
    setOpenDelete,
    setOpenEdit,
    statusColorValues,
    isGettingImage,
    stringPathToRender,
  } = props;

  return (
    <Box
      borderLeft={"1px solid gray"}
      boxShadow={"0 4px 6px rgba(0, 0, 0, 0.5)"}
      transition={"all .3s ease"}
      transform={isOpenSliderTask ? "translateX(0)" : "translateX(400px)"}
      css={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#D3D3D3",
          borderRadius: "4px",
        },
      }}
      backgroundColor={"#e6effc"}
      overflowY={"scroll"}
      zIndex={1000}
      width={isOpenSliderTask ? "40%" : "0%"}
    >
      {selectedTask ? (
        <Box padding={"20px"}>
          <Box
            marginBottom={"10px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Text fontWeight={"bold"}>{selectedTask?.title}</Text>
              <Text>{selectedTask?.description}</Text>
            </Box>

            <SearchIcon marginBottom={"20px"} />
          </Box>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"}>Gestionar registro</Text>
            <Box>
              <Tooltip label="Editar record">
                <IconButton
                  borderRadius={"50%"}
                  boxShadow={"0 4px 8px rgba(0, 0, 0, 0.4);"}
                  onClick={() => setOpenEdit(true)}
                  icon={<Icon as={FcServices} />}
                  aria-label="edit"
                />
              </Tooltip>
              <Tooltip label="Eliminar record">
                <IconButton
                  borderRadius={"50%"}
                  boxShadow={"0 4px 8px rgba(0, 0, 0, 0.4);"}
                  onClick={() => setOpenDelete(true)}
                  marginLeft={"10px"}
                  marginRight={"10px"}
                  icon={<Icon as={FcDeleteDatabase} />}
                  aria-label="delete"
                />
              </Tooltip>
              <Tooltip label="Ver registros">
                <IconButton
                  colorScheme={""}
                  boxShadow={"0 4px 8px rgba(0, 0, 0, 0.5);"}
                  borderRadius={"50%"}
                  icon={<Icon as={FcComboChart} />}
                  aria-label="charts"
                />
              </Tooltip>
            </Box>
          </Box>

          <Box marginTop={"15px"} marginBottom={"25px"}>
            <Text fontWeight={"bold"} marginBottom={"10px"} fontSize={"15px"}>
              Información
            </Text>
            <QuillEditor
              value={selectedTask.info}
              readOnly
              modules={{ toolbar: false }}
              style={{
                backgroundColor: "white",
              }}
            />
          </Box>

          <Box display={"flex"}>
            <Badge
              backgroundColor={selectedTask?.priority?.color}
              ml="1"
              color={"white"}
              fontSize="1.2em"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {selectedTask?.priority?.value}
              <Icon
                marginLeft={"5px"}
                as={getIconValueForPriority(
                  selectedTask?.priority?.value ?? ""
                )}
              />
            </Badge>

            <Badge
              backgroundColor={statusColorValues[selectedTask?.status ?? 0]}
              ml="1"
              color={"white"}
              fontSize="1.2em"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              marginLeft={"15px"}
            >
              {selectedTask?.status}
              <Icon
                marginLeft={"5px"}
                as={getIconValueForStatus(selectedTask?.status ?? "")}
              />
            </Badge>
          </Box>

          <Box>
            <Text marginTop={"20px"} marginBottom={"5px"} fontWeight={"bold"}>
              Fecha de agregación
            </Text>
            <Box display={"flex"} alignItems={"center"}>
              <Icon marginRight={"5px"} as={TbCalendarBolt} />
              <Text>
                {formatDate(selectedTask?.createDate ?? new Date(), "DDD")}
              </Text>
            </Box>
          </Box>

          <Box>
            <Text marginTop={"20px"} marginBottom={"5px"} fontWeight={"bold"}>
              Fecha de cierre
            </Text>
            <Box display={"flex"} alignItems={"center"}>
              <Icon marginRight={"5px"} as={TbCalendarOff} />
              <Text>
                {selectedTask?.finishDate
                  ? formatDate(selectedTask?.finishDate, "DDD")
                  : "Aún esta en proceso"}
              </Text>
            </Box>
          </Box>

          <Box display={"flex"} flexDir={"column"}>
            <Box display={"flex"}>
              <Box>
                <Text
                  marginTop={"20px"}
                  marginBottom={"5px"}
                  fontWeight={"bold"}
                >
                  Horas de expectativa
                </Text>
                <Box display={"flex"} alignItems={"center"}>
                  <Icon marginRight={"5px"} as={AiOutlineClockCircle} />
                  <Text>{selectedTask.expectedWorkingHours} horas</Text>
                </Box>
              </Box>
              <Box marginLeft={"60px"}>
                <Text
                  marginTop={"20px"}
                  marginBottom={"5px"}
                  fontWeight={"bold"}
                >
                  Horas en registro
                </Text>
                <Box display={"flex"} alignItems={"center"}>
                  <Icon marginRight={"5px"} as={TbClockRecord} />
                  <Text>
                    {selectedTask.clockTime?.reduce(
                      (acc, record) => acc + record.recordedTime,
                      0
                    )}{" "}
                    horas
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Progress
            marginTop={"10px"}
            bgColor={"gray.300"}
            colorScheme={getSchemeByValue(
              selectedTask?.clockTime?.reduce(
                (acc, record) => acc + record.recordedTime,
                0
              ),
              selectedTask?.expectedWorkingHours
            )}
            value={selectedTask?.clockTime?.reduce(
              (acc, record) => acc + record.recordedTime,
              0
            )}
            max={selectedTask.expectedWorkingHours}
          />

          <Box>
            <Text marginTop={"15px"} marginBottom={"15px"} fontWeight={"bold"}>
              Multimedia
            </Text>

            <Box>
              {stringPathToRender.length > 0 && !isGettingImage && (
                <React.Fragment>
                  {stringPathToRender.map(
                    (currentPath: IFilePath, index: number) => {
                      return (
                        <Box
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          display={"flex"}
                          marginBottom={"15px"}
                        >
                          <Image
                            style={{
                              borderRadius: "5px",
                            }}
                            boxShadow={"0 2px 4px rgba(0, 0, 0, 0.4)"}
                            cursor={"-webkit-grab"}
                            src={currentPath.relativePath}
                          />
                        </Box>
                      );
                    }
                  )}
                </React.Fragment>
              )}
              {selectedTask?.file?.length === 0 && (
                <React.Fragment>
                  <Text style={{ width: "100%" }}>Sin contenido</Text>
                </React.Fragment>
              )}
              {isGettingImage && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  width={"100%"}
                >
                  <Text
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Obteniendo datos...
                  </Text>
                  <Stack>
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          height={"100%"}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
          backgroundImage={emptyBoxPath.src}
        ></Box>
      )}
    </Box>
  );
};

export default SlideTask;