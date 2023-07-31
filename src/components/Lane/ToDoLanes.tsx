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
        <LaneComponent
          title="Nuevas"
          instance="New"
          bgColor={backGroundLaneColor}
          setSelectedTasks={props.setSelectedTasks}
          isGettingImage={props.isGettingImage}
          data={
            data?.wspData
              ? data?.wspData?.filter(
                  (instance: any) => instance.status === "New"
                )
              : []
          }
        />

        <LaneComponent
          title="En proceso"
          instance="In Proccess"
          bgColor={backGroundLaneColor}
          setSelectedTasks={props.setSelectedTasks}
          isGettingImage={props.isGettingImage}
          data={
            data?.wspData
              ? data?.wspData?.filter(
                  (instance: any) => instance.status === "In Proccess"
                )
              : []
          }
        />

        <LaneComponent
          title="Para revisión"
          instance="For Review"
          bgColor={backGroundLaneColor}
          setSelectedTasks={props.setSelectedTasks}
          isGettingImage={props.isGettingImage}
          data={
            data?.wspData
              ? data?.wspData?.filter(
                  (instance: any) => instance.status === "For Review"
                )
              : []
          }
        />

        <LaneComponent
          title="Finalizadas"
          instance="Finished"
          bgColor={backGroundLaneColor}
          setSelectedTasks={props.setSelectedTasks}
          isGettingImage={props.isGettingImage}
          data={
            data?.wspData
              ? data?.wspData?.filter(
                  (instance: any) => instance.status === "Finished"
                )
              : []
          }
        />

        <LaneComponent
          title="Bloqueadas"
          instance="Blocked"
          bgColor={backGroundLaneColor}
          setSelectedTasks={props.setSelectedTasks}
          isGettingImage={props.isGettingImage}
          data={
            data?.wspData
              ? data?.wspData?.filter(
                  (instance: any) => instance.status === "Blocked"
                )
              : []
          }
        />
      </DndProvider>
    </div>
  );
};

export default ToDoLanes;
