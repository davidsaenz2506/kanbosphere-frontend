import React, { ReactNode, useEffect, useRef } from "react";
import Spinner from "../../../../public/assets/Spinner.gif";
import Image from "next/image";
import * as ReactDOM from "react-dom";

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
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "white", fontSize: "25px" }}>{message}</h1>
        <Image src={Spinner} alt="Spinner" height={100} width={100} />
      </div>
    </div>
  );
};

export default Loading;
