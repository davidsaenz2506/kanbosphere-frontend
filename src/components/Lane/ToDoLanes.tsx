import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import React, { useState } from "react";
import LaneComponent from "./LaneComponent";
import { IDataToDo } from "@/domain/entities/todo.entity";
import { ISprintsData } from "@/domain/entities/userWsps.entity";

interface ILaneProps {
  setSelectedTasks: React.Dispatch<React.SetStateAction<IDataToDo | undefined>>;
  isGettingImage: boolean;
  currentCardHolderHeight: number;
}

const filterItemsMap = {
  New: {
    title: "Pendientes",
    filterValue: "New",
  },
  "In Proccess": {
    title: "En proceso",
    filterValue: "In Proccess",
  },
  "For Review": {
    title: "Para revisión",
    filterValue: "For Review",
  },
  "In Tests": {
    title: "En pruebas",
    filterValue: "In Tests",
  },
  Finished: {
    title: "Finalizadas",
    filterValue: "Finished",
  },
  Blocked: {
    title: "Bloqueo",
    filterValue: "Blocked",
  },
};

const ToDoLanes: React.FC<ILaneProps> = (props) => {
  const { currentWorkSpace: data } = useCurrentWorkspace();
  const [dataWithSprintRelation, setDataWithSprintRelation] =
    useState<IDataToDo[]>();
  const backGroundLaneColor = "#f5f6fA";

  React.useEffect(() => {
    if (data?.container && data?.container?.sprints) {
      const currentWorkspaceTasks: IDataToDo[] | undefined =
        data?.container?.wspData;
      const currentSprintInfo: ISprintsData | undefined =
        data?.container?.sprints.find(
          (currentSprint) => currentSprint.isSprintActive
        );

      if (currentWorkspaceTasks && currentSprintInfo) {
        setDataWithSprintRelation(
          currentWorkspaceTasks.filter((currentTask) =>
            currentSprintInfo?.linkedStories.includes(currentTask.taskId)
          )
        );
      }
    }
  }, [data?.container]);

  return (
    <div
      style={{
        display: "flex",
        marginLeft: "10px",
        flexDirection: "row",
        marginTop: "20px",
        height: "90%",
      }}
    >
      {Object.entries(filterItemsMap).map(
        (currentItemMapped, index: number) => {
          return (
            <LaneComponent
              key={index}
              currentCardHolderHeight={props.currentCardHolderHeight}
              title={currentItemMapped[1].title}
              instance={currentItemMapped[1].filterValue}
              bgColor={backGroundLaneColor}
              setSelectedTasks={props.setSelectedTasks}
              isGettingImage={props.isGettingImage}
              data={
                !data?.isGoalsModeActive
                  ? data?.container?.wspData
                    ? data?.container?.wspData?.filter(
                        (instance: IDataToDo) =>
                          instance.status === currentItemMapped[1].filterValue
                      )
                    : []
                  : dataWithSprintRelation
                  ? dataWithSprintRelation.filter(
                      (instance: IDataToDo) =>
                        instance.status === currentItemMapped[1].filterValue
                    )
                  : []
              }
            />
          );
        }
      )}
    </div>
  );
};

export default ToDoLanes;
