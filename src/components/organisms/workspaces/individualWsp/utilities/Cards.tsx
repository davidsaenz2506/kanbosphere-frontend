import React, { useState } from "react";
import { Card, CardBody, CardFooter } from "@chakra-ui/react";
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
        paddingBottom: "60px",
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
              Crea, administra y gestiona tu lista de tareas pendientes.
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
            <Heading size="md">Tumble Employee Management</Heading>

            <Text py="2">
              Establece y gestiona los usuarios de tu empresa utilizando el crud
              de TEM.
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
          src="https://th.bing.com/th/id/R.bc5d3d51fba513f07648a794f2ea4a02?rik=WFV4m67D%2b9f8sw&riu=http%3a%2f%2fignaciomartineza.com%2fwp-content%2fuploads%2f2017%2f11%2fQu%c3%a9-es-una-hoja-de-c%c3%a1lculo.jpg&ehk=kDx%2fzgsux0%2fmRIHHBD6bY8CCz88bfQ1CJfftjQMwRMs%3d&risl=&pid=ImgRaw&r=0"
        />

        <Stack>
          <CardBody>
            <Heading size="md">Tumble Spreadsheet</Heading>

            <Text py="2">
              Almacena grandes cantidades de datos en Tumble Spreadsheets, una
              hoja de calculo limpia, visualmente atractiva y poderosa.
            </Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                setTitle("Tumble Spreadsheet");
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
