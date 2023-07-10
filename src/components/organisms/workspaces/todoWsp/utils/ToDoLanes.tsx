import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";
import LaneComponent from "./LaneComponent";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const ToDoLanes = () => {
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
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: "30px",
        height: "90%",
      }}
    >
      <LaneComponent
        title="Nuevas"
        bgColor={backGroundLaneColor}
        targetColor="#f1ebac"
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
        bgColor={backGroundLaneColor}
        targetColor="#d9d9de"
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
        bgColor={backGroundLaneColor}
        targetColor="#78bfd6"
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
        bgColor={backGroundLaneColor}
        targetColor="#88daab"
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
        bgColor={backGroundLaneColor}
        targetColor="#ff866c"
        data={
          data?.wspData
            ? data?.wspData?.filter(
                (instance: any) => instance.status === "Blocked"
              )
            : []
        }
      />
    </div>
  );
};

export default ToDoLanes;
