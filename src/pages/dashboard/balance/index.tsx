import Image from "next/image";
import React from "react";

import OutOfService from "../../../../public/assets/outservices.png";
import Calculator from "@/components/Calculator/components/App/App";

export const BalanceUser = () => {
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Calculator/>
      </div>
    </React.Fragment>
  );
};
