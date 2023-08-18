import React, { useState } from "react";
import { useRouter } from "next/router";

import { Badge, Box, Button, Icon, Progress, Tooltip } from "@chakra-ui/react";
import {
  ICollaborators,
  ISprintsData,
  IWspUser,
} from "@/domain/entities/userWsps.entity";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { FcPuzzle, FcInspection, FcBullish } from "react-icons/fc";
import { IDataToDo } from "@/domain/entities/todo.entity";

interface IHeaderProps {
  currentWorkSpace: IWspUser | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorObject: object;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  currentColor: string;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenSliderTask: boolean;
  setOpenSliderTask: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const Header = (Props: IHeaderProps) => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { currentWorkSpace, setAddTask, setOpenSliderTask, isOpenSliderTask } =
    Props;
  const containerPreferences = currentWorkSpace?.collaborators.find(
    (currentCollaborator: ICollaborators) =>
      currentCollaborator._id === currentUser._id
  )?.containerPreferences;
  const isCreateHistoryDisabled: boolean = currentWorkSpace?.container?.sprints?.length === 0 ? true : false;
  const isGoalsModeActive: boolean | undefined = currentWorkSpace?.isGoalsModeActive;
  const [currentAchievementPercentage, setCurrentAchievementPercentage] = useState<number>(0);

  React.useEffect(() => {
    const currentSprint = currentWorkSpace?.container?.sprints?.find(
      (sprints: ISprintsData) => sprints.isSprintActive
    );
    const currentWorkspaceTask: IDataToDo[] | undefined =
      currentWorkSpace?.container?.wspData;

    if (currentSprint && currentWorkspaceTask) {
      const finishedTasks: number = currentWorkspaceTask.reduce(
        (count, object) => {
          if (
            object.status === "Finished" &&
            currentSprint.linkedStories.includes(object.taskId)
          ) {
            return count + 1;
          }
          return count;
        },
        0
      );

      setCurrentAchievementPercentage(
        (finishedTasks / currentWorkspaceTask.length) * 100
      );
    }
  }, [currentWorkSpace?.container?.sprints]);

  return (
    <React.Fragment>
      <Box className="header">
        <h2
          style={{
            textAlign: "start",
            marginTop: "15px",
            marginLeft: "30px",
            color: "#0F0F0F",
            fontSize: "25px",
          }}
        >
          {currentWorkSpace?.container?.wspData === undefined
            ? "Obteniendo datos..."
            : `Tablero Kanban / ${currentWorkSpace?.name}`}
        </h2>
        <Box display={"flex"} alignItems={"center"}>
          <h2
            style={{
              textAlign: "start",
              marginLeft: "30px",
              color: "#0F0F0F",
              fontSize: "18px",
              fontWeight: "initial",
            }}
          >
            {containerPreferences === undefined
              ? "Esto puede tardar dependiento de tu conexion"
              : "prefix" in containerPreferences
              ? `Prefijo de historia ${containerPreferences?.prefix}`
              : "Sin definir..."}
          </h2>
          {isGoalsModeActive && (
            <Box>
              <Badge ml="5" fontSize="1em" mb={2} colorScheme="red">
                No hay un objetivo actual
              </Badge>
              <Badge
                ml="5"
                transition={"all .3s"}
                opacity={isOpenSliderTask ? 0 : 1}
                fontSize="1em"
                mb={2}
                color={"gray.700"}
                bgColor={"gray.300"}
              >
                ⏱ 1 Días restantes
              </Badge>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        style={{ marginRight: "30px" }}
      >
        <Box>
          {isGoalsModeActive && (
            <Tooltip label={"Administrar objetivos"}>
              <Button
                sx={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px" }}
                w={5}
                onClick={() => {
                  const currentPath: string = router.asPath;
                  router.replace(`${currentPath + "/observeScopes"}`);
                }}
              >
                <Icon w={5} h={5} as={FcBullish} />
              </Button>
            </Tooltip>
          )}
          <Tooltip
            label={
              isCreateHistoryDisabled
                ? "Primero debes crear un objetivo"
                : "Registrar historia"
            }
          >
            <Button
              marginLeft={"15px"}
              sx={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px" }}
              onClick={() => setAddTask(true)}
              isDisabled={!isGoalsModeActive ? false : isCreateHistoryDisabled}
              w={5}
            >
              <Icon w={5} h={5} as={FcPuzzle} />
            </Button>
          </Tooltip>
          <Tooltip label="Habilitar inspección">
            <Button
              sx={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px" }}
              marginLeft={"15px"}
              w={5}
              onClick={() => setOpenSliderTask(!isOpenSliderTask)}
            >
              <Icon w={5} h={5} as={FcInspection} />
            </Button>
          </Tooltip>
        </Box>
        {isGoalsModeActive && (
          <Box marginTop={"10px"} cursor={"pointer"}>
            <Tooltip hasArrow bgColor={"whatsapp.500"} label="Progreso actual">
              <Progress colorScheme="green" size="md" value={34.5} />
            </Tooltip>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default Header;
