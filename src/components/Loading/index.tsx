import React from "react";
import Spinner from "../../../public/assets/Spinner.gif";
import Image from "next/image";

interface ILoadingProps {
  message: string;
}

const Loading = (props: ILoadingProps) => {
  const { message } = props;

  return (
    <div
      className="spinnerContainer"
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgba(34,34,34,0.75)",
        position: "fixed",
        zIndex: 1000000,
        width: "100%",
        top: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image style={{marginRight: "20px"}} src={Spinner} alt="Spinner" height={100} width={100} />
        <h1 style={{ color: "white", fontSize: "20px" }}>{message}</h1>
      </div>
    </div>
  );
};

export default Loading;
