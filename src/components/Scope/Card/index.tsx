import React from "react";

import { IDataToDo } from "@/domain/entities/todo.entity";
import { Badge, Box, Tag, Text } from "@chakra-ui/react";

interface IScopeCardProps {
  currentTaskChildren: IDataToDo;
  index: number;
  totalItems: number;
}

const statusColorValues = {
  New: "#FF5733",
  "In Proccess": "#FFC300",
  "For Review": "#6FB98F",
  "In Tests": "#0099CC",
  Finished: "#4B0082",
  Blocked: "#FF3333",
};

const ScopeCardComponent: React.FunctionComponent<IScopeCardProps> = (
  props
) => {
  const { currentTaskChildren, index, totalItems } = props;

  return (
    <React.Fragment>
      <Box
        cursor={"pointer"}
        padding={"5px 10px 5px 10px"}
        borderTop={"1px solid #d9d9e3"}
        borderBottom={index === totalItems - 1 ? "1px solid #d9d9e3" : "none"}
        justifyContent={"space-between"}
        alignItems={"center"}
        transition={"all .2s"}
        display={"flex"}
        _hover={{
          transform: "scale(1.010)",
          bgColor: "#C1E7D9",
        }}
      >
        <Box
          width={"70%"}
          alignItems={"center"}
          display={"flex"}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Box width={"14%"} marginRight={"20px"}>
            <Badge
              textAlign={"center"}
              colorScheme="facebook"
              width={"100%"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTaskChildren.type.label}
            </Badge>
          </Box>
          <Box marginRight={"10px"} width={"14%"}>
            <Text
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              width={"max-content"}
            >
              {currentTaskChildren.title}
            </Text>
          </Box>
          <Box marginRight={"10px"} width={"25%"}>
            <Text
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTaskChildren.description}
            </Text>
          </Box>
          <Box display={"flex"} width={"38%"}>
            <Tag
              width={"50%"}
              marginRight={"20px"}
              colorScheme="cyan"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              🕐 {currentTaskChildren.expectedWorkingHours} horas
            </Tag>
            <Tag
              colorScheme="messenger"
              width={"50%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Sin asignar
            </Tag>
          </Box>
        </Box>

        <Box
          width={"30%"}
          justifyContent={"end"}
          alignItems={"center"}
          display={"flex"}
        >
          <Box justifyContent={"end"} alignItems={"center"} display={"flex"}>
            <Badge
              color={"white"}
              bgColor={statusColorValues[currentTaskChildren.status]}
              minW={"100px"}
              textAlign={"center"}
              width={"max-content"}
            >
              {currentTaskChildren.status}
            </Badge>
          </Box>
          <Box
            marginLeft={"10px"}
            justifyContent={"end"}
            alignItems={"center"}
            display={"flex"}
          >
            <Badge
              color={"blackAlpha.700"}
              bgColor={currentTaskChildren.priority.color}
              textAlign={"center"}
              minW={"70px"}
              width={"max-content"}
            >
              {currentTaskChildren.priority.value}
            </Badge>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default ScopeCardComponent;
