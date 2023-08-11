import React from "react";

import { Box, Button, Icon, Tooltip } from "@chakra-ui/react";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import { TbMoodSearch } from "react-icons/tb";
import { AiFillFileAdd } from "react-icons/ai";

interface IHeaderProps {
  currentWorkSpace: IWspUser | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorObject: object;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  currentColor: string;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenSliderTask: boolean;
  setOpenSliderTask: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const Header = (Props: IHeaderProps) => {
  const { currentWorkSpace, setAddTask, setOpenSliderTask, isOpenSliderTask } = Props;

  return (
    <React.Fragment>
      <Box className="header">
        <h2
          style={{
            textAlign: "start",
            marginTop: "20px",
            marginLeft: "30px",
            color: "#0F0F0F",
            fontSize: "25px",
          }}
        >
          {currentWorkSpace?.wspData === undefined ? "Obteniendo datos...": `Tablero Kanban / ${currentWorkSpace?.name}`}
        </h2>
        <h2
          style={{
            textAlign: "start",
            marginLeft: "30px",
            color: "#0F0F0F",
            fontSize: "18px",
            fontWeight: "initial",
          }}
        >
          {currentWorkSpace?.wspData === undefined ? "Esto puede tardar dependiento de tu conexion": `Prefijo de historia ${currentWorkSpace?.prefix}`}
          
        </h2>
      </Box>
      <Box style={{ marginRight: "30px" }}>
        <Tooltip label="Registrar historia">
          <Button
            sx={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 8px" }}
            onClick={() => setAddTask(true)}
            w={5}
          >
            <Icon w={5} h={5} as={AiFillFileAdd} />
          </Button>
        </Tooltip>
        <Tooltip label="Habilitar inspección">
          <Button
            sx={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 8px" }}
            marginLeft={"20px"}
            w={5}
            onClick={() => setOpenSliderTask(!isOpenSliderTask)}
          >
            <Icon w={5} h={5} as={TbMoodSearch} />
          </Button>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
};

export default Header;
