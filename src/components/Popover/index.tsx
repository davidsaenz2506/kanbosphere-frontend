import { IWspUser } from "@/domain/entities/userWsps.entity";
import { EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
} from "@chakra-ui/react";
import React from "react";

const ShareWorkspacesPopover = (props) => {
  const { isOpen, onToggle, position, workspaces, currentRef } = props;

  return (
    <Popover isOpen={isOpen} placement="bottom" closeOnBlur={false}>
      <PopoverContent
        position={"fixed"}
        ref={currentRef}
        color="white"
        bg="blue.800"
        borderColor="blue.800"
        width={"max-content"}
      >
        <PopoverHeader marginLeft={"10px"} pt={4} fontWeight="bold" border="0">
          Compartir espacio de trabajo
        </PopoverHeader>
        <PopoverArrow bg="blue.800" />
        <PopoverCloseButton onClick={onToggle} />
        <PopoverBody>
          {workspaces.map((currentSpace: IWspUser) => {
            return (
              <Box
                margin={"0 10px 20px 10px"}
                display={"flex"}
                alignItems={"center"}
              >
                <Box>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Nombre:</span>{" "}
                    {currentSpace.name}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: "bold" }}>Tipo:</span>{" "}
                    {currentSpace.type}
                  </Text>

                  <Text>
                    <span style={{ fontWeight: "bold" }}>Id:</span>{" "}
                    {currentSpace._id}
                  </Text>
                </Box>
                <Box
                  marginLeft={"40px"}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Button
                    leftIcon={<EmailIcon />}
                    colorScheme="teal"
                    variant="solid"
                  >
                    Enviar invitación
                  </Button>
                </Box>
              </Box>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareWorkspacesPopover;
