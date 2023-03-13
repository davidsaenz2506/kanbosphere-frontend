import React from "react";
import { Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";

import styles from "../../../../../styles/cardlane.module.css";
import MiniCard from "./MiniCard";

const LaneComponent = ({ title, bgColor, data }) => {

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
        <Heading size="md"> {title} {data.length} </Heading>
      </CardHeader>
      <CardBody sx={{marginTop: "-20px", cursor: "default"}}>
        {data.map((item: any) => {
          return (
             <MiniCard item={item} bgColor={bgColor} />
          );
        })}
      </CardBody>
    </Card>
  );
};

export default LaneComponent;
