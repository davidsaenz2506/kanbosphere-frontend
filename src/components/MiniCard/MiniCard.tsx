import React, { RefObject } from "react";

import { Badge, Box, Icon, Text, useOutsideClick } from "@chakra-ui/react";
import { IDataToDo } from "@/domain/entities/todo.entity";
import {
  getIconValueForPriority,
  getIconValueForStatus,
} from "@/utilities/icons";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { UpdateWorkSpace } from "@/services/workspaces/update";

import { FcClock } from "react-icons/fc";
import { useDrag } from "react-dnd";
import currentBiridectionalCommunication from "@/services/socket";
import { ICollaborators } from "@/domain/entities/userWsps.entity";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

interface IMiniCardProps {
  item: IDataToDo;
  key: number;
  setSelectedTasks: React.Dispatch<React.SetStateAction<IDataToDo | undefined>>;
  isGettingImage: boolean;
}

const ItemTypes = {
  CARD: "CARD",
};

const statusColorValues = {
  New: "#FF5733",
  "In Proccess": "#FFC300",
  "For Review": "#6FB98F",
  "In Tests": "#0099CC",
  Finished: "#4B0082",
  Blocked: "#FF3333",
};

const MiniCard = (Props: IMiniCardProps) => {
  const { currentUser } = useCurrentUser();
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const { item, key, setSelectedTasks, isGettingImage } = Props;
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { type: ItemTypes.CARD, item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const ref: RefObject<HTMLElement | null | undefined> = React.useRef();

  useOutsideClick({
    ref: ref as RefObject<HTMLElement>,
    handler: () => setIsClicked(false),
  });

  async function sendToServerTask() {
    const currentUserUpdatedData: ICollaborators | undefined = currentWorkSpace?.collaborators.find((currentCollaborator: ICollaborators) => currentCollaborator._id === currentUser._id);
    const currentCollaborators: ICollaborators[] | undefined = currentWorkSpace?.collaborators;

    if (currentUserUpdatedData && currentCollaborators) {
      currentUserUpdatedData.containerPreferences = { ...currentUserUpdatedData?.containerPreferences, selectedTask: item.taskId };
      const modifiedCollaborators: ICollaborators[] = currentCollaborators.map((collaborator: ICollaborators) => {
          if (collaborator._id === currentUserUpdatedData._id) return currentUserUpdatedData;
          
          return collaborator;
      })

      await UpdateWorkSpace(currentWorkSpace?._id, {
        body: {
          collaborators: modifiedCollaborators
        },
        transactionObject: {
          currentRoomToken: { roomToken: currentWorkSpace?._id ?? "" },
          currentUserSocketId: currentBiridectionalCommunication.id,
        },
      });
    }
  }

  return (
    <Box
      ref={(node) => drag(node)}
      key={key}
      style={{
        height: "max-content",
        backgroundColor: isHovered ? "#D5E9FF" : "whitesmoke",
        marginBottom: "10px",
        padding: "10px",
        transition: "all .1s",
        transform: isClicked ? "scale(1.05)" : "none",
        opacity: isDragging ? 0 : 1,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        cursor: isGettingImage ? "not-allowed" : "grab",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        onClick={() => {
          if (!isGettingImage) {
            setIsClicked(true);
            setSelectedTasks(item);

            const currentUserUpdatedData: ICollaborators | undefined = currentWorkSpace?.collaborators.find((currentCollaborator: ICollaborators) => currentCollaborator._id === currentUser._id);
            const currentCollaborators: ICollaborators[] | undefined = currentWorkSpace?.collaborators;
            

            if (currentWorkSpace && currentUserUpdatedData && currentCollaborators) {
              currentUserUpdatedData.containerPreferences = { ...currentUserUpdatedData?.containerPreferences, selectedTask: item.taskId };
              const modifiedCollaborators: ICollaborators[] = currentCollaborators.map((collaborator: ICollaborators) => {
                  if (collaborator._id === currentUserUpdatedData._id) return currentUserUpdatedData;
                  
                  return collaborator;
              })
        
              setCurrentWorkSpace({
                ...currentWorkSpace,
                collaborators: modifiedCollaborators
              });
              sendToServerTask();
            }
          }
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          <p style={{ fontWeight: "bold", fontSize: "15px" }}>{item.title}</p>
          <Badge variant="solid" bgColor={statusColorValues[item.status]}>
            {item.status}
          </Badge>
        </Box>

        <p
          style={{
            fontSize: "15px",
            marginBottom: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.description}
        </p>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
                backgroundColor: "#ECECEC",
                padding: "3px",
                borderRadius: "5px",
                boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Icon
                as={getIconValueForStatus(item.status)}
                aria-label="status-icon"
                w={6}
                h={6}
              />
            </Box>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px",
                backgroundColor: "#ECECEC",
                borderRadius: "5px",
                boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Icon
                as={getIconValueForPriority(item.priority.value)}
                aria-label="status-icon"
                w={6}
                h={6}
              />
            </Box>
          </Box>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              padding: "3px",
              backgroundColor: "#ECECEC",
              borderRadius: "5px",
              boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Icon as={FcClock} aria-label="expected-time" w={6} h={6} />
            <Text marginLeft={"3px"} marginRight={"3px"}>
              {item.expectedWorkingHours}h
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MiniCard;
