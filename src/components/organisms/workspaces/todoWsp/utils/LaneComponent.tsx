import React from "react";
import { Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";

import styles from "../../../../../styles/cardlane.module.css";
import MiniCard from "./MiniCard";

const LaneComponent = ({ title, bgColor, data, targetColor }) => {
  return (
    <React.Fragment>
      <Card
        className={styles.container}
        sx={{
          minWidth: "300px",
          backgroundColor: bgColor,
          marginLeft: "20px",
          overflowY: "auto",
          zIndex: 1,
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px;",
        }}
      >
        <CardHeader>
          <Heading
            size="md"
            sx={{ color: "#182433", textAlign: "center", fontWeight: 0 }}
          >
            {" "}
            {title}: {data.length} Records
          </Heading>
        </CardHeader>
        <CardBody sx={{ marginTop: "-20px", cursor: "default" }}>
          {data.map((item: any, key: number) => {
            return <MiniCard key={key} item={item} targetColor={targetColor} />;
          })}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default LaneComponent;
