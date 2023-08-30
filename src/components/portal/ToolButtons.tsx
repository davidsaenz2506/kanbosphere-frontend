import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import { ChevronDownIcon } from "@chakra-ui/icons";

import { Box, Icon, Divider, Button } from "@chakra-ui/react";

import styles from "../../styles/ToolButtons.module.css";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

import DeleteWorkSpace from "../Modals/DeleteWorkSpace";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import EditWorkSpaceName from "../Modals/EditWorkSpaceName";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { useRouter } from "next/router";

import { BsCalendarMonth, BsMenuButtonWide, BsPeople } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import { PiProjectorScreenChartDuotone } from "react-icons/pi";

import { LiaCloudSolid } from "react-icons/lia";

function delayTime(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface IToolButtonsProps {
  setIsTriggerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToolButtons: React.FunctionComponent<IToolButtonsProps> = (props) => {
  const { setIsTriggerActive } = props;
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const wspUsers = useWorkspace();
  const currentSession = useCurrentUser();
  const currentWorkSpace = useCurrentWorkspace();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [item, setItem] = useState<IWspUser>();
  const [currentSelected, setCurrentSelected] = useState<string>("");

  const router = useRouter();
  const { query } = router;

  async function handleRouterPath(caseUrl: string) {
    setIsTriggerActive(true);

    setCurrentSelected("");
    router.push(`/dashboard?briefcase=${caseUrl}`);
    await delayTime(150);

    currentWorkSpace.setCurrentWorkSpace(undefined);
    await delayTime(66);

    setIsTriggerActive(false);
  }

  return (
    <>
      {item && (
        <DeleteWorkSpace
          isOpen={openDelete}
          onClose={setOpenDelete}
          data={item}
        />
      )}
      {item && (
        <EditWorkSpaceName
          isOpen={openEdit}
          onClose={setOpenEdit}
          data={item}
        />
      )}
      <Box
        className={styles.generalButtons}
        style={{
          paddingTop: "10px",
          color: "#252525",
          backgroundColor: "rgb(255, 255, 255)",
        }}
      >
        <Box
          className={styles.mainObject}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"50px"}
        >
          <Icon width={"50px"} height={"50px"} as={LiaCloudSolid} />
        </Box>
        <Divider
          width={"70%"}
          marginLeft={"10px"}
          marginBottom={"10px"}
          marginTop={"10px"}
        />
        <Box
          backgroundColor={
            query.briefcase == "main" ? "#f0f0f0" : "transparent"
          }
          className={styles.buttonSpace}
        >
          <Button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              fontSize: "15px",
            }}
            onClick={() => {
              const caseUrl: string = "main";
              handleRouterPath(caseUrl);
            }}
          >
            <Icon as={BsMenuButtonWide} />
          </Button>
        </Box>

        <Box
          backgroundColor={
            query.briefcase == "create" ? "#f0f0f0" : "transparent"
          }
          className={styles.buttonSpace}
        >
          <Button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              fontSize: "15px",
            }}
            onClick={() => {
              const caseUrl: string = "create";
              handleRouterPath(caseUrl);
            }}
          >
            <Icon
              w={5}
              h={5}
              as={PiProjectorScreenChartDuotone}
              sx={{ marginLeft: "-3px" }}
            />
          </Button>
        </Box>
      </Box>

      <Box
        backgroundColor={
          query.briefcase == "friends" ? "#f0f0f0" : "transparent"
        }
        className={styles.buttonSpace}
      >
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#252525",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "friends";
            handleRouterPath(caseUrl);
          }}
        >
          <Icon as={BsPeople} sx={{ color: "#252525" }} />
        </Button>
      </Box>

      <Box
        backgroundColor={query.briefcase == "meets" ? "#f0f0f0" : "transparent"}
        className={styles.buttonSpace}
      >
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#1C1C1C",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "meets";
            handleRouterPath(caseUrl);
          }}
        >
          <Icon as={BsCalendarMonth} sx={{ color: "#252525" }} />
        </Button>
      </Box>

      <Box
        backgroundColor={
          query.briefcase == "balance" ? "#f0f0f0" : "transparent"
        }
        className={styles.buttonSpace}
      >
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#1C1C1C",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "balance";
            handleRouterPath(caseUrl);
          }}
        >
          <Icon w={5} h={5} as={TbPigMoney} sx={{ color: "#252525" }} />
        </Button>
      </Box>
    </>
  );
};

export default ToolButtons;
