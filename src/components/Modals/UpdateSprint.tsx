import React, { useMemo, useState } from "react";
import {
  Box,
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
import currentBiridectionalCommunication from "@/services/socket";
import { UpdateSprintCard } from "@/services/workspaces/sprints/updateSprint";

import Select, { MultiValue, StylesConfig } from "react-select";

import { DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IPicklistOptions } from "./AddColumn";

import { DateTime } from "luxon";

interface IAddTaskProps {
  sprintId: string;
  setSprintId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateSprint: React.FunctionComponent<IAddTaskProps> = (props) => {
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const { isOpen, onClose, isLoading, setIsLoading, setSprintId, sprintId } =
    props;
  const [selectedTasksToSprint, setSelectedTasksToSprint] =
    useState<IPicklistOptions[]>();
  const [sprintToModify, setSprintToModify] = useState<ISprintsData>();
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const customStyles = {
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(33,42,62,1)",
      borderRadius: "4px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: "white",
      margin: "2px",
      "&:hover": {
        backgroundColor: "#f5f5f5",
        color: "rgba(33,42,62,1)",
        transition: "all .2s",
      },
    }),
    menuList: (provided) => ({
      ...provided,
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#ccc",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#aaa",
      },
    }),
  };

  async function modifySprint() {
    const currentSprints: ISprintsData[] | undefined = currentWorkSpace?.container.sprints;
    const indexToReplace : number | undefined = currentSprints?.findIndex((currentTool) => currentTool.sprintId === sprintId);

    if (currentSprints && sprintToModify && currentWorkSpace && indexToReplace !== undefined) {
      setIsLoading(true);
      currentSprints.splice(indexToReplace, 1, sprintToModify);

      await UpdateSprintCard(currentWorkSpace._id, {
        body: sprintToModify,
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
      onClose(false);
    }
  }

  function handleSelect(ranges) {
    const startDate = ranges.selection.startDate;
    const endDate = ranges.selection.endDate;

    setSelectionRange({
      startDate: startDate,
      endDate: endDate,
      key: ranges.selection.key,
    });
  }

  React.useEffect(() => {
    const currentSprint: ISprintsData | undefined =
      currentWorkSpace?.container?.sprints?.find(
        (currentSprint) => currentSprint.sprintId === sprintId
      );

    if (
      currentSprint &&
      selectionRange.endDate &&
      selectionRange.startDate &&
      selectedTasksToSprint
    ) {
      currentSprint.sprintStartDate = DateTime.fromISO(
        selectionRange.startDate.toISOString()
      ).toISODate();
      currentSprint.sprintEndDate = DateTime.fromISO(
        selectionRange.endDate.toISOString()
      ).toISODate();
      currentSprint.linkedStories = selectedTasksToSprint?.map(
        (currentSelection) => currentSelection.value
      );
      currentSprint.isSprintActive = true;

      setSprintToModify(currentSprint);
    }
  }, [selectionRange, selectedTasksToSprint]);

  return (
    <React.Fragment>
      <Modal
        style={{ height: "max-content", borderRadius: "5px" }}
        open={isOpen}
        onClose={() => {
          onClose(false);
          setSprintId(undefined);
        }}
        width="600px"
      >
        <Modal.Header style={{ marginBottom: "-10px", fontSize: "18px" }}>
          Iniciar objetivo
        </Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormLabel>Intervalo de tiempo</FormLabel>
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"max-content"}
              border={"2px solid #d9d9e3"}
            >
              <DateRangePicker
                minDate={new Date()}
                ranges={[selectionRange]}
                onChange={handleSelect}
              />
            </Box>

            <FormLabel marginTop={"20px"}>Historias vinculadas</FormLabel>
            <Select
              menuPlacement="auto"
              closeMenuOnSelect={false}
              isMulti
              styles={customStyles}
              options={currentWorkSpace?.container.wspData?.map(
                (currentWspData) => {
                  return {
                    label: currentWspData.title,
                    value: currentWspData.taskId,
                  };
                }
              )}
              onChange={(e) => {
                if (e) {
                  setSelectedTasksToSprint(
                    e.map((currentSelectedChunk) => {
                      return {
                        value: currentSelectedChunk.value,
                        label: currentSelectedChunk.label,
                      };
                    })
                  );
                }
              }}
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
                modifySprint();
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

          <Button
            onClick={() => {
              onClose(false);
              setSprintId(undefined);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default UpdateSprint;
