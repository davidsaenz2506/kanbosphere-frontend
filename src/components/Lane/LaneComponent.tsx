import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Skeleton,
  Box,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useDrop } from "react-dnd";

import styles from "../../styles/cardlane.module.css";
import MiniCard from "../MiniCard/MiniCard";

import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateCard } from "@/services/workspaces/updateCard";
import currentBiridectionalCommunication from "@/services/socket";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspContext } from "@/context/usersWorkSpaces/wsp.context";
import { handleAndUpdateAllWorkspacesAfterDatabaseChange } from "@/utilities/updateAllWorkspaces";
import { useLoadingChunk } from "@/context/loadingChunks/loadingChunk.hook";

const statusColorValues = {
  New: "#FF5733",
  "In Proccess": "#FFC300",
  "For Review": "#6FB98F",
  Finished: "#4B0082",
  Blocked: "#FF3333",
};

const LaneComponent = ({
  title,
  instance,
  bgColor,
  data,
  setSelectedTasks,
  isGettingImage,
  currentCardHolderHeight,
}) => {
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const { loadingChunk } = useLoadingChunk();
  const [skeletonAmount, setSkeletonAmount] = useState<number>(0);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "CARD",
    drop: async (item: { type: string; item: IDataToDo }) => {
      if (item.item.status !== instance) {
        const currentWorkspaceData: IDataToDo[] | undefined =
          currentWorkSpace?.wspData;
        const modifiedWorkspaceData: IDataToDo[] | undefined =
          currentWorkspaceData?.map((currentRecord) =>
            currentRecord.taskId === item.item.taskId
              ? { ...currentRecord, status: instance }
              : currentRecord
          );
        const modifiedRecord: IDataToDo | undefined =
          modifiedWorkspaceData?.find(
            (currentRecord) => currentRecord.taskId === item.item.taskId
          );

        // @ts-ignore
        const modifiedWorkspace: IWspUser | undefined = {
          ...currentWorkSpace,
          wspData: modifiedWorkspaceData,
        };

        // @ts-ignore
        setCurrentWorkSpace(modifiedWorkspace);

        if (modifiedRecord)
          await UpdateCard(currentWorkSpace?._id, {
            body: modifiedRecord,
            transactionObject: {
              currentUserSocketId: currentBiridectionalCommunication.id,
              currentRoomToken: {
                roomToken: currentWorkSpace?._id ?? "",
              },
            },
          });
      }
    },
    canDrop: (item) => {
      if (item.item.status === instance) return false;
      return true;
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    setSkeletonAmount(Math.floor(currentCardHolderHeight / 80));
  }, [currentCardHolderHeight]);

  useEffect(() => {
    const currentCardHolderElement: HTMLElement | null = document.getElementById("cardHolder");
    if (currentCardHolderElement) {
      setSkeletonAmount(Math.floor(currentCardHolderElement?.getBoundingClientRect().height / 80));
    }
  }, []);

  return (
    <React.Fragment>
      <Card
        id="cardHolder"
        ref={drop}
        className={styles.container}
        sx={{
          width: "250px",
          minWidth: "250px",
          backgroundColor: bgColor,
          overflowY: currentWorkSpace?.wspData === undefined ? "hidden" : "auto",
          zIndex: 1,
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px;",
          height: "100%",
          marginLeft: "20px",
          marginRight: "10px",
          borderRadius: "5px",
        }}
      >
        <CardHeader
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgColor={statusColorValues[instance]}
        >
          <Text
            size="md"
            sx={{
              color: "white",
              fontWeight: "500",
              fontSize: "19px",
              marginTop: "-10px",
            }}
          >
            {" "}
            {title}: {data.length} Records
          </Text>
        </CardHeader>
        <CardBody
          sx={{
            marginTop: "-10px",
            paddingTop: "15px",
            transition: "all .1s",
            cursor: "default",
            border: isOver
              ? canDrop
                ? "2px dashed green"
                : "2px dashed red"
              : "none",
            borderRadius: isOver ? "8px" : "0px",
            backgroundColor: isOver
              ? canDrop
                ? "#C1E7D9"
                : "#FFD4D4"
              : bgColor,
          }}
        >
          {(currentWorkSpace?.wspData === undefined) &&
            Array.from({ length: skeletonAmount }, (_, index) => index + 1).map(
              (_: number) => {
                return (
                  <Box
                    marginBottom={"10px"}
                    padding="2"
                    boxShadow="lg"
                    bg="white"
                  >
                    <SkeletonCircle size="5" />
                    <SkeletonText
                      mt="4"
                      noOfLines={4}
                      spacing="2"
                      skeletonHeight="1"
                    />
                  </Box>
                );
              }
            )}

          {!loadingChunk &&
            data.map((item: IDataToDo, key: number) => {
              return (
                <MiniCard
                  key={key}
                  item={item}
                  isGettingImage={isGettingImage}
                  setSelectedTasks={setSelectedTasks}
                />
              );
            })}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LaneComponent;
