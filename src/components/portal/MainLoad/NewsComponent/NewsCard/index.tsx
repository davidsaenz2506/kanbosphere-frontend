import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { INewsCard } from "@/domain/entities/newsCard";
import { ArrowRightIcon } from "@chakra-ui/icons";

interface INewsComponentProps {
  cardItems: INewsCard;
  changeAction: () => void;
}

const NewsCard: React.FC<INewsComponentProps> = ({
  cardItems,
  changeAction,
}) => {
  const [translateMathValue, setTransaleMathValue] = useState(1);
  const { author, role, date, content, image } = cardItems;
  return (
    <React.Fragment>
      <Card
        sx={{
          backgroundColor: "#f8f8f8",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          color: "#1C1C1C",
          width: "100%",
          maxWidth: "max-content",
          opacity: translateMathValue,
          transition: "opacity .8s ease-in-out",
          marginTop: "40px",
        }}
        maxW="md"
      >
        <CardHeader>
          <Flex>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name={author} />
              <Box>
                <Heading size="sm">{author} </Heading>
                <Text>{role} </Text>
              </Box>
            </Flex>
            <IconButton
              variant="ghost"
              aria-label="Change new"
              onClick={() => {
                setTransaleMathValue(0);
                setTimeout(() => {
                  changeAction();
                  setTransaleMathValue(1);
                }, 500);
              }}
              icon={<ArrowRightIcon />}
            />
          </Flex>
        </CardHeader>
        <CardBody sx={{ marginTop: "-20px" }}>
          <Text sx={{ fontWeight: "bold", marginBottom: "10px" }}>{date}</Text>
          <Text>{content}</Text>
        </CardBody>
        <Image objectFit="cover" src={image} alt="Chakra UI" />
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
    </React.Fragment>
  );
};

export default NewsCard;
