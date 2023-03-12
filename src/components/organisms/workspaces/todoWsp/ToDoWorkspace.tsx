import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import React from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

const ToDoWorkspace = () => {

  const currentWsp = useCurrentWorkspace();

  React.useEffect(() => {
     const todoDocument : HTMLDivElement | null = document.querySelector(".todoContainer");
     const navBarDocument : any = document.getElementById("navbarHome");
     const bodyDocument : HTMLBodyElement | null = document.querySelector("body");

    if (todoDocument && bodyDocument) {
      todoDocument.style.height = `${bodyDocument.getBoundingClientRect().height - navBarDocument.getBoundingClientRect().height}px`;
    }
  })

  return (
    <div
      className="todoContainer"
      style={{ width: "100%", overflowX: "scroll" }}
    >
      <div className="header">
        <h2
          style={{ textAlign: "start", marginTop: "20px", marginLeft: "30px" }}
        >
          Bienvenido a tu espacio de trabajo To Do David!
        </h2>
        <p style={{ textAlign: "start", marginLeft: "32px" }}>
          Aqui podras revisar tus tareas de trabajo y gestionarlas.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginRight: "20px",
          marginLeft: "20px",
          marginTop: "30px",
        }}
      >
        <Card sx={{ minWidth: "500px" }}>
          <CardHeader>
            <Heading size="md"> In process</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card sx={{ minWidth: "500px" }}>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card sx={{ minWidth: "500px" }}>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
        <Card sx={{ minWidth: "500px" }}>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>

        <Card sx={{ minWidth: "500px" }}>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ToDoWorkspace;
