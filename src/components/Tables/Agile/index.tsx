import React from "react";
import {
  Box,
  Icon,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { formatDate } from "@/utilities/date/format";
import { Avatar } from "@nextui-org/react";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";
import { DeleteIcon, EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FcDataSheet, FcQuestions, FcTodoList } from "react-icons/fc";

interface AgileComponent {
  agileSpaceChunkData: IWspUser[];
}

const getChunkIcon = (currentChunkType: string) => {
  switch (currentChunkType) {
    case "agile":
      return <FcTodoList />;
    case "spreadsheet":
      return <FcDataSheet />;
    default:
      return <FcQuestions />;
  }
};

const TableAgile: React.FC<AgileComponent> = (props) => {
  const { agileSpaceChunkData } = props;
  const currentSession = useCurrentUser();
  const currentContact = useCurrentContact();

  const tableCssProperties = {
    bgColor: "#212a3e",
    textColor: "white",
  };

  return (
    <React.Fragment>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr bg={tableCssProperties.bgColor}>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Nombre
              </Th>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Tipo
              </Th>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Fecha de creación
              </Th>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Id creador
              </Th>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Usuarios activos
              </Th>
              <Th textAlign={"center"} color={tableCssProperties.textColor}>
                Opciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {agileSpaceChunkData.map((currentChunk) => {
              const activeUsers = [
                currentChunk.createdById,
                ...currentChunk.collaborators,
              ];

              return (
                <Tr bg={"gray.100"}>
                  <Td textAlign={"center"}>{currentChunk.name}</Td>
                  <Td textAlign={"center"}>
                    <Box
                      display={"flex"}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                    >
                      <Icon as={() => getChunkIcon(currentChunk.type)} />
                      <Text marginLeft={"10px"} fontWeight={"bolder"}>
                        {currentChunk.type.toUpperCase()}
                      </Text>
                    </Box>
                  </Td>
                  <Td textAlign={"center"}>
                    {formatDate(currentChunk.createdDate, "DDD")}{" "}
                  </Td>
                  <Td textAlign={"center"}>{currentChunk.createdById} </Td>
                  <Td justifyContent={"center"} display={"flex"}>
                    {currentContact.currentContacts?.friends &&
                      currentContact.currentContacts.friends.map(
                        (currentDataInfo) => {
                          if (
                            currentDataInfo?._id &&
                            activeUsers.includes(currentDataInfo?._id)
                          ) {
                            return;
                          }

                          return (
                            <Avatar
                              src={currentDataInfo?.profilePicture}
                              style={{ marginRight: "-10px" }}
                              width={10}
                              height={10}
                            />
                          );
                        }
                      )}
                    <Avatar
                      src={currentSession.currentUser.profilePicture}
                      width={10}
                      height={10}
                    />
                  </Td>
                  <Td textAlign={"center"}>
                    <IconButton
                      borderRadius={"50%"}
                      colorScheme="blue"
                      variant={"solid"}
                      icon={<ExternalLinkIcon />}
                      aria-label="info"
                    />
                    <IconButton
                      borderRadius={"50%"}
                      marginLeft={"5px"}
                      marginRight={"5px"}
                      colorScheme="green"
                      variant={"solid"}
                      icon={<EditIcon />}
                      aria-label="edit"
                    />
                    <IconButton
                      borderRadius={"50%"}
                      colorScheme="red"
                      variant={"solid"}
                      icon={<DeleteIcon />}
                      aria-label="delete"
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default TableAgile;
