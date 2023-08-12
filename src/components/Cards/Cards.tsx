import React, { useState } from "react";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  Portal,
  StatHelpText,
  StatLabel,
  StatNumber,
  Stat,
  StatArrow,
  Divider,
  AbsoluteCenter,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { Stack, Image, Heading, Button, Text } from "@chakra-ui/react";

import OpenWorkSpace from "../Modals/OpenWorkSpace";
import Loading from "@/components/Loading";

interface ICardComponentProps {
  name: string;
  description: string;
  pictureURL: string;
  cssProperties: {
    transform: string;
    zIndex: number;
  };
  workflow: string;
  zIndex: number;
  isPopular: boolean;
  stats: any;
  tags: string[];
}

const workspacesInfo: ICardComponentProps[] = [
  {
    name: "Kanban",
    description:
      "Desarrolla proyectos junto a tu equipo más fácilmente con este agradable sistema de seguimiento de historias.",
    pictureURL:
      "https://firebasestorage.googleapis.com/v0/b/kanbosphere-files.appspot.com/o/static%2Fkanban.jpg?alt=media&token=65625405-b5df-4fcf-b014-753a17979585",
    cssProperties: {
      transform: "translateY(-10px)",
      zIndex: 1000,
    },
    workflow: "agile",
    zIndex: 1,
    isPopular: true,
    stats: {
      users: 100,
      percentage: "23.67%",
      isOver: false,
    },
    tags: ["Nice", "Peace", "Teamwork", "Kanban", "Agile"],
  },
  {
    name: "Grid",
    description:
      "Registra grandes volúmenes de datos con esta poderosa y simplificada hoja de cálculo que te permite almacenar todo tipo de campos.",
    pictureURL:
      "https://firebasestorage.googleapis.com/v0/b/kanbosphere-files.appspot.com/o/static%2Fgrid.jpg?alt=media&token=2e4f15a2-a46f-44e1-a8ed-c3986abd5052",
    cssProperties: {
      transform: "translateY(-10px)",
      zIndex: 1000,
    },
    workflow: "spreadsheet",
    zIndex: 0,
    isPopular: true,
    stats: {
      users: 87,
      percentage: "52.54%",
      isOver: false,
    },
    tags: ["Excel", "Spreadsheet", "Google sheet", "Easy", "Beautiful"],
  },
  {
    name: "Employee Management",
    description:
      "  Establece y gestiona los usuarios de tu empresa utilizando el crud de KEM.",
    pictureURL:
      "https://firebasestorage.googleapis.com/v0/b/kanbosphere-files.appspot.com/o/static%2Femployee.jpg?alt=media&token=6d91d304-1c1a-4667-b3cc-56efc22711e2",
    cssProperties: {
      transform: "translateY(-10px)",
      zIndex: 1000,
    },
    workflow: "management",
    zIndex: 1,
    isPopular: false,
    stats: {
      users: 56,
      percentage: "33.12%",
      isOver: true,
    },
    tags: ["Companies", "Bussiness", "Workers"],
  },
];

const Cards = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [currentHoveredItemSelected, setCurrentHoveredItemSelected] =
    useState<number>();

  return (
    <div
      className="workTarget"
      style={{
        overflowY: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 0px 80px 20px",
        marginBottom: "80px",
      }}
    >
      {isLoading && (
        <Portal>
          <Loading message="Agregando espacio de trabajo a su portafolio" />
        </Portal>
      )}
      <OpenWorkSpace
        isOpen={isOpenModal}
        title={title}
        setIsOpen={setIsOpenModal}
        setIsLoading={setIsLoading}
      />
      {workspacesInfo.map(
        (currentInfoTarget: ICardComponentProps, index: number) => {
          return (
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              transition={"all .5s"}
              css={{
                "::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                  opacity:
                    currentHoveredItemSelected !== undefined &&
                    currentHoveredItemSelected !== index
                      ? 1
                      : 0,
                  transition: "opacity 0.3s ease-in-out",
                },
              }}
              sx={{ width: "100%" }}
              marginRight={"20px"}
              height={"85vh"}
              maxHeight={"750px"}
              zIndex={currentInfoTarget.zIndex}
              onMouseEnter={() => {
                setCurrentHoveredItemSelected(index);
              }}
              onMouseLeave={() => {
                setCurrentHoveredItemSelected(undefined);
              }}
              _hover={{
                transform: currentInfoTarget.cssProperties.transform,
                zIndex: currentInfoTarget.cssProperties.zIndex,
              }}
              cursor={"pointer"}
            >
              <Image
                width={"50%"}
                boxShadow={"0px 4px 10px rgba(0, 0, 0, 0.3)"}
                objectFit="cover"
                src={currentInfoTarget.pictureURL}
              />

              <Stack width={"50%"}>
                <CardBody>
                  <Box display={"flex"} flexDir={"column"} height={"100%"}>
                    <Box height={"50%"}>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Heading size="md">{currentInfoTarget.name}</Heading>
                        {currentInfoTarget.isPopular && (
                          <Badge
                            marginBottom={"10px"}
                            variant="solid"
                            colorScheme="green"
                          >
                            Pop
                          </Badge>
                        )}
                      </Box>

                      <Text fontSize={"15px"} py="0">
                        {currentInfoTarget.description}
                      </Text>
                    </Box>

                    <Box position="relative" padding="0">
                      <Divider />
                      <AbsoluteCenter bg="white" px="3">
                        Stats
                      </AbsoluteCenter>
                    </Box>

                    <Box
                      paddingTop={"30px"}
                      bgColor={"white"}
                      display={"flex"}
                      flexDir={"column"}
                      alignItems={"flex-start"}
                      height={"50%"}
                    >
                      <Box>
                        <Stat>
                          <StatLabel>Número de usuarios</StatLabel>
                          <StatNumber>
                            {currentInfoTarget.stats.users}
                          </StatNumber>
                          <StatHelpText>
                            <StatArrow
                              type={
                                currentInfoTarget.stats.isOver
                                  ? "decrease"
                                  : "increase"
                              }
                            />
                            {currentInfoTarget.stats.percentage}
                          </StatHelpText>
                        </Stat>

                        <HStack flexWrap={"wrap"} display={"flex"} marginTop={"20px"} spacing={2}>
                          {currentInfoTarget.tags.map(
                            (tagInfo: string, index: number) => (
                              <Tag
                                size={"sm"}
                                key={index}
                                variant="subtle"
                                colorScheme="green"
                              >
                                {tagInfo}
                              </Tag>
                            )
                          )}
                        </HStack>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>

                <CardFooter>
                  <Button
                    variant="solid"
                    isDisabled={currentInfoTarget.workflow === "management"}
                    backgroundColor={"rgba(33,42,62,1)"}
                    color={"white"}
                    _hover={{}}
                    zIndex={1}
                    onClick={() => {
                      setTitle(currentInfoTarget.workflow);
                      setIsOpenModal(true);
                    }}
                  >
                    Usar
                  </Button>
                </CardFooter>
              </Stack>
            </Card>
          );
        }
      )}
    </div>
  );
};

export default Cards;
