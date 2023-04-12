import React from "react";
import { Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";

import styles from "../../../../../styles/cardlane.module.css";
import MiniCard from "./MiniCard";

const LaneComponent = ({ title, bgColor, data, targetColor }) => {

  return (
    <Card
      className={styles.container}
      sx={{
        minWidth: "350px",
        backgroundColor: bgColor,
        marginLeft: "20px",
        overflowY: "auto",
      }}
    >
      <CardHeader>
        <Heading size="md" sx={{color: "white"}}> {title} {data.length} </Heading>
      </CardHeader>
      <CardBody sx={{marginTop: "-20px", cursor: "default"}}>
        {data.map((item: any, key: number) => {
          return (
             <MiniCard key={key} item={item} bgColor={bgColor} targetColor={targetColor} />
          );
        })}
      </CardBody>
    </Card>
  );
};

export default LaneComponent;
