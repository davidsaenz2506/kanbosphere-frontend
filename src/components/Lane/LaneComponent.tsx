import React from "react";
import { Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";
import { useDrop } from "react-dnd";

import styles from "../../styles/cardlane.module.css";
import MiniCard from "../MiniCard/MiniCard";

import { IDataToDo } from "@/domain/entities/todo.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateCard } from "@/services/workspaces/updateCard";

const LaneComponent = ({
  title,
  instance,
  bgColor,
  data,
  setSelectedTasks,
  isGettingImage,
}) => {
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
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
        setCurrentWorkSpace({
          ...currentWorkSpace,
          wspData: modifiedWorkspaceData,
        });

        if (modifiedRecord)
          await UpdateCard(currentWorkSpace?._id, modifiedRecord);
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

  return (
    <React.Fragment>
      <Card
        ref={drop}
        className={styles.container}
        sx={{
          width: "250px",
          minWidth: "250px",
          backgroundColor: bgColor,
          overflowY: "auto",
          zIndex: 1,
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px;",
          height: "100%",
          marginLeft: "20px",
          marginRight: "10px"
        }}
      >
        <CardHeader>
          <Heading
            size="md"
            sx={{
              color: "#182433",
              textAlign: "center",
              fontWeight: "initial",
              fontSize: "18px"
            }}
          >
            {" "}
            {title}: {data.length} Records
          </Heading>
        </CardHeader>
        <CardBody
          sx={{
            marginTop: "-10px",
            transition: "all .1s",
            cursor: "default",
            border: isOver ?  ( canDrop ? "2px dashed green" : "2px dashed red" )  : "none",
            borderRadius: "8px",
            backgroundColor: isOver ? ( canDrop ? "#C1E7D9" : "#FFD4D4" ) : bgColor,
            paddingTop: "5px",
          }}
        >
          {data.map((item: IDataToDo, key: number) => {
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
