import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";
import LaneComponent from "./LaneComponent";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { IDataToDo } from "@/domain/entities/todo.entity";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ILaneProps {
  setSelectedTasks: React.Dispatch<React.SetStateAction<IDataToDo | undefined>>;
  isGettingImage: boolean;
}

const filterItemsMap = {
  New: {
    title: "Nuevas",
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
  const { currentWorkSpace: data, setCurrentWorkSpace: setData } =
    useCurrentWorkspace();
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
      <DndProvider backend={HTML5Backend}>
        {Object.entries(filterItemsMap).map((currentItemMapped) => {
          return (
            <LaneComponent
              title={currentItemMapped[1].title}
              instance={currentItemMapped[1].filterValue}
              bgColor={backGroundLaneColor}
              setSelectedTasks={props.setSelectedTasks}
              isGettingImage={props.isGettingImage}
              data={ data?.wspData ? data?.wspData?.filter((instance: any) => instance.status === currentItemMapped[1].filterValue) : [] }
            />
          );
        })}
      </DndProvider>
    </div>
  );
};

export default ToDoLanes;
