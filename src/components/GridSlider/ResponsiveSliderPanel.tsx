import {
  Search2Icon,
  AddIcon,
  PlusSquareIcon,
  DeleteIcon,
  ExternalLinkIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import { addGridRow } from "../../libraries/spreadsheet/Grid/utils/functions/addGridRow";
import { deleteGridRow } from "../../libraries/spreadsheet/Grid/utils/functions/deleteIndividualGridRows";
import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";

interface ISlideProps {
  setTypeQueryFromUser: any;
  currentWorkSpace: ICurrentWspContext;
  keyCodeFromEnterDown: number;
  handleUserQuery(): Promise<void>;
  setAddTask: (value: React.SetStateAction<boolean>) => void;
  currentRowsSelected: number[] | undefined;
  toastNotification: any;
  exportToExcel(): void;
  setOpenSlider: (value: React.SetStateAction<boolean>) => void;
}

const ResponsiveSliderPanel = (Props: ISlideProps) => {
  const {
    setAddTask,
    setOpenSlider,
    toastNotification,
    exportToExcel,
    currentRowsSelected,
    currentWorkSpace,
    keyCodeFromEnterDown,
    handleUserQuery,
    setTypeQueryFromUser,
  } = Props;

  return (
    <React.Fragment>
      <InputGroup>
        <InputLeftElement>
          <Search2Icon />
        </InputLeftElement>
        <Input
          sx={{ backgroundColor: "white", width: "97%" }}
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTypeQueryFromUser({
              workspaceID: currentWorkSpace.currentWorkSpace._id ?? "",
              query: e.currentTarget.value,
            })
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.keyCode === keyCodeFromEnterDown) handleUserQuery();
          }}
          placeholder="Filtra tus datos aquí"
        />
      </InputGroup>
      <Divider style={{ marginTop: "40px" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "40px",
          alignItems: "flex-start",
        }}
      >
        <h3>Opciones de acceso rápido</h3>
        <div style={{ marginBottom: "20px", marginTop: "30px" }}>
          <Button
            onClick={() => {
              setAddTask(true);
            }}
          >
            <AddIcon sx={{ marginRight: "10px" }} />
            Añadir Columna
          </Button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Button onClick={() => addGridRow(currentWorkSpace)}>
            <PlusSquareIcon sx={{ marginRight: "10px" }} />
            Añadir fila
          </Button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Button
            onClick={() =>
              deleteGridRow(
                currentRowsSelected,
                currentWorkSpace,
                toastNotification
              )
            }
            isDisabled={currentRowsSelected !== undefined ? false : true}
          >
            <DeleteIcon sx={{ marginRight: "10px" }} />
            Eliminar fila
          </Button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Button onClick={() => exportToExcel()}>
            <ExternalLinkIcon sx={{ marginRight: "10px" }} />
            Exportar excel
          </Button>
        </div>
        <div style={{ marginRight: "20px" }}>
          <Button
            onClick={() => {
              setOpenSlider(true);
            }}
          >
            <EditIcon sx={{ marginRight: "10px" }} />
            Grid config
          </Button>
        </div>

      
      </div>
    </React.Fragment>
  );
};

export default ResponsiveSliderPanel;
