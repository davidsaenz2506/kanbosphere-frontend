import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import React from "react";
import LaneComponent from "./LaneComponent";

const ToDoLanes = () => {

  const {currentWorkSpace : data } = useCurrentWorkspace()

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "30px",
        maxHeight: "82%",
      }}
    >
      <LaneComponent title="Nuevas" bgColor="#f1ebac" data={data.wspData ? data?.wspData?.filter((instance: any) => instance.status === "New") : []} />
      <LaneComponent title="En proceso" bgColor="#d9d9de" data={data.wspData ? data?.wspData?.filter((instance: any) => instance.status === "In Proccess") : []} />
      <LaneComponent title="Para revisión" bgColor="#78bfd6" data={data.wspData ? data?.wspData?.filter((instance: any) => instance.status === "For Review") : []} />
      <LaneComponent title="Finalizadas" bgColor="#88daab" data={data.wspData ? data?.wspData?.filter((instance: any) => instance.status === "Finished") : []} />
      <LaneComponent title="Bloqueadas" bgColor="#ff866c" data={data.wspData ? data?.wspData?.filter((instance: any) => instance.status === "Blocked") : []} />
    </div>
  );
};

export default ToDoLanes;
