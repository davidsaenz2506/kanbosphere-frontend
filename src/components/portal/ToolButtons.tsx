import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import { ChevronDownIcon } from "@chakra-ui/icons";

import {
  List,
  ListItem,
  ListIcon,
  Stack,
  Box,
  Icon,
  Text,
  Divider,
  Button,
} from "@chakra-ui/react";

import { Skeleton } from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import styles from "../../styles/ToolButtons.module.css";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

import { DeleteIcon } from "@chakra-ui/icons";
import DeleteWorkSpace from "../Modals/DeleteWorkSpace";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import EditWorkSpaceName from "../Modals/EditWorkSpaceName";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import { useRouter } from "next/router";

import {
  BsKanban,
  BsUiChecksGrid,
  BsCalendarMonth,
  BsMenuButtonWide,
  BsPeople,
} from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import { PiProjectorScreenChartDuotone } from "react-icons/pi";

import { LiaCloudSolid } from "react-icons/lia";
import { useLoadingChunk } from "@/context/loadingChunks/loadingChunk.hook";

function delayTime(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface IToolButtonsProps {
  setIsTriggerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToolButtons: React.FunctionComponent<IToolButtonsProps>  = (props) => {
  const { setIsTriggerActive } = props;
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const wspUsers = useWorkspace();
  const currentSession = useCurrentUser();
  const currentWorkSpace = useCurrentWorkspace();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [item, setItem] = useState<IWspUser>();
  const [currentSelected, setCurrentSelected] = useState<string>("");
  const { loadingChunk } = useLoadingChunk();

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
        style={{ marginTop: "10px", color: "#252525" }}
      >
        <Box
          className={styles.mainObject}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          marginRight={"10px"}
          height={"50px"}
        >
          <Icon
            width={"50px"}
            height={"50px"}
            marginRight={"10px"}
            as={LiaCloudSolid}
          />
          <p style={{ fontSize: "20px" }}>Kanbosphere</p>
        </Box>
        <Divider
          width={"86%"}
          marginLeft={"20px"}
          marginBottom={"10px"}
          marginTop={"10px"}
        />
        <Box
          backgroundColor={
            query.briefcase == "main" ? "#f0f0f0" : "transparent"
          }
          className={styles.buttonSpace}
        >
          <Icon as={BsMenuButtonWide} sx={{ marginLeft: "20px" }} />
          <Button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "5px",
              fontSize: "15px",
            }}
            onClick={() => {
              const caseUrl: string = "main";
              handleRouterPath(caseUrl);
            }}
          >
            Menú principal
          </Button>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "5px",
            marginBottom: "5px",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginLeft={"10px"}
            marginRight={"10px"}
            bgColor={" #d9eaf2"}
            borderRadius={isCollapsed ? "10px" : "10px 10px 0 0"}
          >
            <Box>
              <Icon
                w={5}
                h={5}
                as={PiProjectorScreenChartDuotone}
                sx={{ marginLeft: "18px" }}
              />
              <Button
                type="button"
                className="btn btn-secondary btn-lg btn-block"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#1C1C1C",
                  marginLeft: "4px",
                  fontSize: "15px",
                }}
                onClick={() => {
                  const caseUrl: string = "create";
                  handleRouterPath(caseUrl);
                }}
              >
                Builds
              </Button>
            </Box>
            <Box>
              <ChevronDownIcon
                w={6}
                h={6}
                sx={{
                  marginRight: "15px",
                  cursor: "pointer",
                  transition: "all .2s ease-in",
                  transform: `rotate(${!isCollapsed ? "90" : 0}deg)`,
                }}
                onClick={() => setIsCollapsed(!isCollapsed)}
              />
            </Box>
          </Box>

          <Box
            bgColor={"#d9eaf2"}
            className={isCollapsed ? styles.collapsed : styles.expanded}
          >
            {!currentSession.currentUser.userID && !wspUsers.userWsps.length ? (
              <Stack
                style={{
                  width: "90%",
                  marginTop: "0px",
                  marginBottom: "10px",
                  marginLeft: "13px",
                }}
              >
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : (
              <List>
                {wspUsers.userWsps.map((todoWorkspace, index) => (
                  <ListItem
                    key={index}
                    cursor={"pointer"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "40px",
                      fontSize: "13px",
                      alignItems: "center",
                      color: "#1C1C1C",
                      marginTop: index === 0 ? "-10px" : "0px",
                      marginBottom:
                        index === wspUsers.userWsps.length - 1 ? "0px" : "8px",
                    }}
                  >
                    <Box
                      maxWidth={"160px"}
                      minWidth={"160px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      <ListIcon
                        as={
                          todoWorkspace.type === "agile"
                            ? BsKanban
                            : BsUiChecksGrid
                        }
                        w={4}
                        h={4}
                        sx={{ marginRight: "10px" }}
                      />
                      <Text
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        fontSize={"15px"}
                        fontWeight={
                          currentSelected === todoWorkspace._id
                            ? "bolder"
                            : "normal"
                        }
                        onClick={async () => {
                          if (loadingChunk) return;
                          if (
                            currentWorkSpace.currentWorkSpace?._id ===
                            todoWorkspace._id
                          )
                            return;
                          setIsTriggerActive(true);
                          setCurrentSelected(todoWorkspace._id);

                          router.push(
                            `/dashboard?briefcase=${todoWorkspace.type}&fridgeKey=${todoWorkspace._id}`
                          );
                          await delayTime(150);

                          currentWorkSpace.setCurrentWorkSpace(undefined);
                          await delayTime(66);

                          setIsTriggerActive(false);
                        }}
                      >
                        {" "}
                        {todoWorkspace.name}
                      </Text>
                    </Box>

                    <Box style={{ display: "flex" }}>
                      <EditIcon
                        sx={{ marginRight: "10px" }}
                        onClick={() => {
                          setItem(todoWorkspace);
                          setOpenEdit(true);
                        }}
                      />
                      <DeleteIcon
                        onClick={() => {
                          setItem(todoWorkspace);
                          setOpenDelete(true);
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        backgroundColor={
          query.briefcase == "friends" ? "#f0f0f0" : "transparent"
        }
        className={styles.buttonSpace}
      >
        <Icon as={BsPeople} sx={{ marginLeft: "21px", color: "#252525" }} />
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#252525",
            marginLeft: "4px",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "friends";
            handleRouterPath(caseUrl);
          }}
        >
          Social
        </Button>
      </Box>

      <Box
        backgroundColor={query.briefcase == "meets" ? "#f0f0f0" : "transparent"}
        className={styles.buttonSpace}
      >
        <Icon
          as={BsCalendarMonth}
          sx={{ marginLeft: "21px", color: "#252525" }}
        />
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginLeft: "4px",
            color: "#1C1C1C",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "meets";
            handleRouterPath(caseUrl);
          }}
        >
          Calendario
        </Button>
      </Box>

      <Box
        backgroundColor={
          query.briefcase == "balance" ? "#f0f0f0" : "transparent"
        }
        className={styles.buttonSpace}
      >
        <Icon
          w={5}
          h={5}
          as={TbPigMoney}
          sx={{ marginLeft: "20px", color: "#252525" }}
        />
        <Button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginLeft: "1px",
            color: "#1C1C1C",
            fontSize: "15px",
          }}
          onClick={() => {
            const caseUrl: string = "balance";
            handleRouterPath(caseUrl);
          }}
        >
          Mis Ingresos
        </Button>
      </Box>
    </>
  );
};

export default ToolButtons;
