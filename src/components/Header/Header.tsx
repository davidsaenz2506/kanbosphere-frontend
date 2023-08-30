import React, { useState } from "react";
import { useRouter } from "next/router";

import {
  Badge,
  Box,
  Button,
  Icon,
  Progress,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  ICollaborators,
  ISprintsData,
  IWspUser,
} from "@/domain/entities/userWsps.entity";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { GrInspect } from "react-icons/gr";
import { MdOutlineAutoGraph, MdBookmarkAdd } from "react-icons/md";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { useLoadingChunk } from "@/context/loadingChunks/loadingChunk.hook";
import { Avatar } from "@nextui-org/react";
import { AiOutlineClockCircle } from "react-icons/ai";
import ICurrentUser from "@/domain/entities/user.entity";
import { DateTime } from "luxon";

interface IHeaderProps {
  currentWorkSpace: IWspUser | undefined;
  currentUsers: ICurrentUser[] | undefined;
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
  const { loadingChunk } = useLoadingChunk();
  const {
    currentWorkSpace,
    setAddTask,
    setOpenSliderTask,
    isOpenSliderTask,
    currentUsers,
  } = Props;
  const containerPreferences = currentWorkSpace?.collaborators.find(
    (currentCollaborator: ICollaborators) =>
      currentCollaborator._id === currentUser._id
  )?.containerPreferences;
  const isCreateHistoryDisabled: boolean =
    currentWorkSpace?.container?.sprints?.length === 0 ? true : false;
  const isGoalsModeActive: boolean | undefined =
    currentWorkSpace?.isGoalsModeActive;
  const [currentAchievementPercentage, setCurrentAchievementPercentage] =
    useState<number>(0);
  const [currentSprintActive, setCurrentSprintActive] =
    useState<ISprintsData>();
  const [daysToFinishSprint, setDaysToFinishSprint] = useState<number>(0);

  React.useEffect(() => {
    if (currentWorkSpace?.isGoalsModeActive) {
      const currentSprint = currentWorkSpace?.container?.sprints?.find(
        (sprints: ISprintsData) => sprints.isSprintActive
      );
      const currentWorkspaceTask: IDataToDo[] | undefined =
        currentWorkSpace?.container?.wspData;

      if (
        currentSprint &&
        currentWorkspaceTask &&
        currentSprint.sprintEndDate
      ) {
        const currentDate = DateTime.local();
        const currentSprintFinishDate = DateTime.fromISO(
          currentSprint.sprintEndDate
        );
        const diff = currentSprintFinishDate.diff(currentDate, [
          "years",
          "months",
          "days",
          "hours",
        ]).days;

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

        setCurrentSprintActive(currentSprint);
        setCurrentAchievementPercentage(
          (finishedTasks / currentWorkspaceTask.length) * 100
        );
        setDaysToFinishSprint(diff);
      }
    }
  }, [currentWorkSpace?.container?.sprints]);

  return (
    <React.Fragment>
      <Box display={"flex"} alignItems={"center"}>
        <Stack
          opacity={loadingChunk ? 1 : 0}
          transition={"all .2s"}
          position={"absolute"}
          marginLeft={"30px"}
          width={"60%"}
        >
          <Skeleton width={"100%"} height="25px" />
          <Skeleton width={"100%"} height="10px" />
        </Stack>

        <Box
          opacity={!loadingChunk ? 1 : 0}
          transition={"all .5s"}
          display={"flex"}
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"start"}
          ml={"8"}
        >
          <Box
            style={{
              textAlign: "start",
              color: "#0F0F0F",
              fontSize: "18px",
              whiteSpace: "nowrap",
            }}
            display={"flex"}
          >
            <Text
              marginTop={"3px"}
              fontSize={"20px"}
            >{`Contenedores / ${currentWorkSpace?.name}`}</Text>
            {isGoalsModeActive && (
              <Box display={"flex"} alignItems={"center"}>
                <Badge ml={8} mr={10} fontSize=".8em" colorScheme="red">
                  {currentSprintActive?.sprintPurpose ?? "No disponible"}
                </Badge>
                <Avatar.Group count={currentUsers?.length}>
                  {currentUsers &&
                    currentUsers.map(
                      (currentUser: ICurrentUser, index: number) => (
                        <Avatar
                          key={index}
                          size="md"
                          pointer
                          src={currentUser.profilePicture}
                          bordered
                          color="gradient"
                          stacked
                        />
                      )
                    )}
                </Avatar.Group>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        style={{ marginRight: "20px" }}
      >
        <Box display={"flex"}>
          {isGoalsModeActive && (
            <Badge
              mr={2}
              ml={2}
              transition={"all .3s"}
              fontSize="1em"
              color={"gray.700"}
              bgColor={"gray.300"}
              display={"flex"}
              alignItems={"center"}
            >
              <Icon mr={"1"} mb={"1px"} as={AiOutlineClockCircle} />
              <Text fontSize={".8em"}>
                {currentSprintActive &&
                  (!daysToFinishSprint
                    ? "Termina en menos de un día"
                    : `${daysToFinishSprint} días restantes`)}
                {!currentSprintActive && "Sin objetivos"}
              </Text>
            </Badge>
          )}
          {isGoalsModeActive && (
            <Tooltip label={"Administrar objetivos"}>
              <Button
                bgColor={"transparent"}
                size={"xs"}
                onClick={() => {
                  const currentPath: string = router.asPath;
                  router.replace(`${currentPath + "/observeScopes"}`);
                }}
              >
                <Icon w={4} h={4} as={MdOutlineAutoGraph} />
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
              marginLeft={"5px"}
              bgColor={"transparent"}
              size={"xs"}
              onClick={() => setAddTask(true)}
              isDisabled={!isGoalsModeActive ? false : isCreateHistoryDisabled}
            >
              <Icon w={4} h={4} as={MdBookmarkAdd} />
            </Button>
          </Tooltip>
          <Tooltip label="Habilitar inspección">
            <Button
              bgColor={"transparent"}
              marginLeft={"5px"}
              size={"xs"}
              onClick={() => setOpenSliderTask(!isOpenSliderTask)}
            >
              <Icon w={4} h={4} as={GrInspect} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Header;
