import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Stack, Image, Heading, Button, Text } from "@chakra-ui/react";

import OpenWorkSpace from "../../../modals/OpenWorkSpace";

const Cards = () => {
  
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <div
      className="workTarget"
      style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OpenWorkSpace
        isOpen={isOpenModal}
        title={title}
        setIsOpen={setIsOpenModal}
      />
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        sx={{ marginBottom: "30px", width: "80%" }}
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://img.bantoa.com/images/landing/1643-default.jpg"
        />

        <Stack>
          <CardBody>
            <Heading size="md">To Do Workspace</Heading>

            <Text py="2">
              Crea, administra y gestiona tu lista de tareas pendientes
            </Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                setTitle("To Do");
                setIsOpenModal(true);
              }}
            >
              Usar
            </Button>
          </CardFooter>
        </Stack>
      </Card>

      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        sx={{ marginBottom: "30px", width: "80%" }}
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://img.freepik.com/foto-gratis/hombre-joven-camiseta-tomando-notas-portapapeles-mirando-ocupado_176474-17008.jpg"
        />

        <Stack>
          <CardBody>
            <Heading size="md">Notas Rapidas</Heading>

            <Text py="2">
              La herramienta de Notas Rapidas te permite crear una interfaz
              bastante amigable donde podras registrar datos importantes,
              incluyendo imagenes, ecuaciones matematicas, graficos y muchas
              otras opciones más
            </Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                setTitle("Fast Notes");
                setIsOpenModal(true);
              }}
            >
              Usar
            </Button>
          </CardFooter>
        </Stack>
      </Card>

      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        sx={{ marginBottom: "30px", width: "80%" }}
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://theurbanhosts.com/wp-content/uploads/2022/02/entradablog01.jpg"
        />

        <Stack>
          <CardBody>
            <Heading size="md">Calculadora Tumble</Heading>

            <Text py="2">
              Resuelve operaciones matematicas, obten conversión de unidades,
              monedas y registra estos datos en tu agenda Tumble
            </Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                setTitle("Tumble Calculator");
                setIsOpenModal(true);
              }}
            >
              Usar
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
};

export default Cards;
