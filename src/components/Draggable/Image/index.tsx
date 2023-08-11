import { IFilePath } from "@/domain/entities/todo.entity";
import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useDrag } from "react-dnd";

interface IDraggableImage {
  currentPath: IFilePath;
  index: number;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemTypes = {
  CARD: "IMAGE",
};

const DraggableImage: React.FunctionComponent<IDraggableImage> = (props) => {
  const { currentPath, index, setIsDragging } = props;
  const objectToDelete: {
    index: number;
    name: string;
    relativePath: string;
  } = { ...currentPath, index: index };
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { type: ItemTypes.CARD, objectToDelete },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Box
      key={index}
      style={{ cursor: "move" }}
      opacity={isDragging ? 0 : 1}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      marginRight={"10px"}
      onDrag={() => {
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
    >
      <Image
        ref={(node) => drag(node)}
        width={100}
        height={100}
        style={{
          borderRadius: "5px",
          maxHeight: "100px",
          maxWidth: "100px",
        }}
        boxShadow={"0 2px 4px rgba(0, 0, 0, 0.4)"}
        src={currentPath.relativePath}
      />
      <Text style={{ fontSize: "10px" }}>{currentPath.name}</Text>
    </Box>
  );
};

export default DraggableImage;
