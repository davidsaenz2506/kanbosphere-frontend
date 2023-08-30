import React, { useMemo, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { Modal } from "@nextui-org/react";
import { ISprintsData } from "@/domain/entities/userWsps.entity";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import { AddSprintCard } from "@/services/workspaces/sprints/addSprint";
import currentBiridectionalCommunication from "@/services/socket";

interface IAddTaskProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSprint: React.FunctionComponent<IAddTaskProps> = (props) => {
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const { isOpen, onClose, isLoading, setIsLoading } = props;
  const [purpose, setPurpose] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [newSprint, setNewSprint] = useState<ISprintsData>();

  const sprintId = useMemo<string>(
    () => Math.random().toString(36).substr(2, 18),
    [isOpen]
  );

  React.useEffect(() => {
    if (purpose && description) {
      setNewSprint({
        sprintId: sprintId,
        sprintPurpose: purpose,
        sprintDescription: description,
        isAFinishedSprint: false,
        finishDate: null,
        isSprintActive: false,
        sprintStartDate: null,
        sprintEndDate: null,
        linkedStories: [],
      });
    }
  }, [purpose, description]);

  async function addSprint() {
    const currentSprints: ISprintsData[] | undefined =
      currentWorkSpace?.container.sprints;

    if (currentSprints && newSprint && currentWorkSpace) {
      setIsLoading(true);
      currentSprints.push(newSprint);

      await AddSprintCard(currentWorkSpace._id, {
        body: newSprint,
        transactionObject: {
          currentUserSocketId: currentBiridectionalCommunication.id,
          currentRoomToken: {
            roomToken: currentWorkSpace._id,
          },
        },
      });

      setCurrentWorkSpace({
        ...currentWorkSpace,
        container: {
          ...currentWorkSpace?.container,
          sprints: currentSprints,
        },
      });

      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <Modal
        style={{ height: "max-content", borderRadius: "5px" }}
        open={isOpen}
        onClose={() => onClose(false)}
        width="800px"
      >
        <Modal.Header style={{ marginBottom: "-10px", fontSize: "18px" }}>
          Añadir Objetivo
        </Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormLabel>Proposito</FormLabel>
            <Input
              type="text"
              isRequired
              placeholder="Escribe aquí el propósito de tu Sprint"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPurpose(e.target.value)
              }
            />

            <FormLabel marginTop={"20px"}>Descripción</FormLabel>
            <Input
              type="text"
              isRequired
              placeholder="Proporciona una breve descripción"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
            />
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <Button
            backgroundColor={"rgba(33,42,62,1)"}
            mr={3}
            color={"white"}
            _hover={{}}
            onClick={() => {
              if (purpose && description) {
                addSprint();
                onClose(false);
              }
            }}
          >
            {isLoading && (
              <>
                <Spinner marginRight={"15px"} />
                <Text style={{ color: "white" }}>Guardando</Text>
              </>
            )}
            {!isLoading && (
              <>
                <Text style={{ color: "white" }}>Guardar objetivo</Text>
              </>
            )}
          </Button>

          <Button onClick={() => onClose(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default AddSprint;
