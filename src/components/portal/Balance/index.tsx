import Image from "next/image";
import React from "react";

import OutOfService from "../../../../public/assets/outservices.png";

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
        <Image
          style={{ marginBottom: "90px" }}
          src={OutOfService}
          alt="Out of service data"
        />
      </div>
    </React.Fragment>
  );
};
