import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";
import LaneComponent from "./LaneComponent";

const ToDoLanes = () => {
  const { currentWorkSpace: data } = useCurrentWorkspace();
  const backGroundLaneColor = "#f8f8f8";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "30px",
        height: "90%"
      }}
    >
      <LaneComponent
        title="Nuevas"
        bgColor={backGroundLaneColor}
        targetColor="#f1ebac"
        data={
          data.wspData
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
          data.wspData
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
          data.wspData
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
          data.wspData
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
          data.wspData
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
