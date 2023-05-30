import { ICurrentUserContext } from "@/context/currentUser/currentUser.context";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Text,
  Box,
  IconButton,
  Heading,
  Flex,
  Avatar,
  Button,
} from "@chakra-ui/react";

import React, { useState } from "react";

import styles from "./main.module.css";

import WeatherComponent from "./WeatherComponent";
import UserComponent from "./UserComponent";

import { DateTime } from "luxon";

export const MainLoad = () => {
  const { currentUser }: ICurrentUserContext = useCurrentUser();
  const currentDateTime = DateTime.now().toFormat("DDD").toString();

  return (
    <React.Fragment>
      <div className={styles.mainContainer}>
        <div className={styles.userNewsSection}>
          <div className={styles.userInfo}>
            <h1 style={{ color: "whitesmoke", fontSize: "40px" }}>
              Bienvenido de nuevo {currentUser.fullname}
            </h1>
            <p style={{ color: "whitesmoke", fontWeight: "bold" }}>
              ¡El equipo Tumble espera que estés teniendo un maravilloso día!
            </p>
          </div>
          <div className={styles.userProps}>
            <WeatherComponent />
            <UserComponent />
          </div>
        </div>
        <div className="tumbleNewsSection" style={{ display: "flex" }}>
          <Card
            sx={{
              marginTop: "40px",
              marginBottom: "40px",
              marginRight: "20px",
              backgroundColor: "#3E5F8A",
              color: "white",
            }}
            maxW="md"
          >
            <CardHeader>
              <Flex>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name="Laura Villamil" />

                  <Box>
                    <Heading size="sm">Laura Villamil</Heading>
                    <Text>Director of Design Services and Co-Founder</Text>
                  </Box>
                </Flex>
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                />
              </Flex>
            </CardHeader>
            <CardBody sx={{ marginTop: "-20px" }}>
              <Text sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                {currentDateTime}
              </Text>
              <Text>
                Nos alegra comunicarte que se está implementando la versión 4.5
                de Tumble Tasks, te ofreceremos muchas novedades para que puedas
                realizar tus tareas del día a día, te deseamos un excelente día,
                atentamente, Tumble Dev Management-
              </Text>
            </CardBody>
            <Image
              objectFit="cover"
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Chakra UI"
            />
            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            ></CardFooter>
          </Card>
          <Card
            sx={{
              marginTop: "40px",
              marginBottom: "40px",
              marginRight: "20px",
              backgroundColor: "#3E5F8A",
              color: "white",
            }}
            maxW="md"
          >
            <CardHeader>
              <Flex>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name="Laura Villamil" />

                  <Box>
                    <Heading size="sm">Laura Villamil</Heading>
                    <Text>Director of Design Services and Co-Founder</Text>
                  </Box>
                </Flex>
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                />
              </Flex>
            </CardHeader>
            <CardBody sx={{ marginTop: "-20px" }}>
              <Text sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                {currentDateTime}
              </Text>
              <Text>
                Tumble Tasks ampliará sus plataformas para dar servicios de
                administración y gestión documental en agosto, no te lo pierdas,
                será una barbaridad! 😍💻
              </Text>
            </CardBody>
            <Image
              objectFit="cover"
              src="https://papyrum.com/wp-content/uploads/2018/07/beneficios_de_la_gestion_documental.png"
              alt="Chakra UI"
            />
            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            ></CardFooter>
          </Card>
          <Card
            sx={{
              marginTop: "40px",
              marginBottom: "40px",
              backgroundColor: "#3E5F8A",
              color: "white",
            }}
            maxW="md"
          >
            <CardHeader>
              <Flex>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name="David Saenz" />

                  <Box>
                    <Heading size="sm">David Saenz</Heading>
                    <Text>Tumble Company CEO</Text>
                  </Box>
                </Flex>
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                />
              </Flex>
            </CardHeader>
            <CardBody sx={{ marginTop: "-20px" }}>
              <Text sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                {currentDateTime}
              </Text>
              <Text>
                Actualmente, en el desarrollo de Tumble Tasks, estamos
                desarrollando nuevas funciones en la hoja de cálculo de datos,
                disponible en junio.
              </Text>
            </CardBody>
            <Image
              objectFit="cover"
              src="https://www.becas-santander.com/content/dam/becasmicrosites/blog/metodolog%C3%ADas-de-desarrollo-de-software.jpg"
              alt="Chakra UI"
            />
            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            ></CardFooter>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};
