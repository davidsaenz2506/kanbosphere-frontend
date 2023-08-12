import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";
import LaneComponent from "./LaneComponent";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { IDataToDo } from "@/domain/entities/todo.entity";

interface ILaneProps {
  setSelectedTasks: React.Dispatch<React.SetStateAction<IDataToDo | undefined>>;
  isGettingImage: boolean;
  currentCardHolderHeight: number
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
  const { currentWorkSpace: data, setCurrentWorkSpace: setData } = useCurrentWorkspace();
  const generalWorkspaceData = useWorkspace();
  const backGroundLaneColor = "#f5f6fA";

  React.useEffect(() => {
    const currentWorkSpace: IWspUser | undefined =
      generalWorkspaceData.userWsps.find(
        (currentWsp) => currentWsp?._id === data?._id
      );
    setData(currentWorkSpace);
  }, [generalWorkspaceData.userWsps]);

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
        {Object.entries(filterItemsMap).map((currentItemMapped) => {
          return (
            <LaneComponent
              currentCardHolderHeight={props.currentCardHolderHeight}
              title={currentItemMapped[1].title}
              instance={currentItemMapped[1].filterValue}
              bgColor={backGroundLaneColor}
              setSelectedTasks={props.setSelectedTasks}
              isGettingImage={props.isGettingImage}
              data={ data?.container?.wspData ? data?.container?.wspData?.filter((instance: any) => instance.status === currentItemMapped[1].filterValue) : [] }
            />
          );
        })}
    </div>
  );
};

export default ToDoLanes;
