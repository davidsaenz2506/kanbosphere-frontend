import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  ArrowForwardIcon,
  AttachmentIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { ChatIcon, CalendarIcon, StarIcon } from "@chakra-ui/icons";

import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import { List, ListItem, ListIcon, Stack } from "@chakra-ui/react";

import { Skeleton } from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import styles from "../../styles/ToolButtons.module.css";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

import { DeleteIcon } from "@chakra-ui/icons";
import DeleteWorkSpace from "../organisms/modals/Workspace Modals/DeleteWorkSpace";
import { IWspUser } from "@/domain/entities/userWsps.entity";
import EditWorkSpaceName from "../organisms/modals/Workspace Modals/EditWorkSpaceName";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

const ToolButtons = ({ workspaceFlow, setWorkSpaceFlow }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const wspUsers = useWorkspace();
  const currentSession = useCurrentUser();
  const currentWorkSpace = useCurrentWorkspace();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [item, setItem] = useState<IWspUser>();
  const [currentSelected, setCurrentSelected] = useState<any>("");

  return (
    <>
      <DeleteWorkSpace
        isOpen={openDelete}
        onClose={setOpenDelete}
        data={item}
        setWorkSpaceFlow={setWorkSpaceFlow}
      />
      <EditWorkSpaceName isOpen={openEdit} onClose={setOpenEdit} data={item} />
      <div style={{ marginTop: "10px", color: "#252525" }}>
        <div className={styles.buttonSpace}>
          <HamburgerIcon sx={{ marginLeft: "20px" }} />
          <button
            type="button"
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",
              marginLeft: "5px",
              fontWeight: workspaceFlow == "mainMenu" ? "bolder" : "normal",
            }}
            onClick={() => {
              setCurrentSelected("");
              setWorkSpaceFlow("mainMenu");
            }}
          >
            Menú principal
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <AttachmentIcon sx={{ marginLeft: "20px" }} />
            <button
              type="button"
              className="btn btn-secondary btn-lg btn-block"
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#1C1C1C",
                marginLeft: "5px",
                fontWeight: workspaceFlow == "wspUser" ? "bolder" : "normal",
              }}
              onClick={() => {
                setCurrentSelected("");
                setWorkSpaceFlow("wspUser");
              }}
            >
              Workspaces
            </button>
          </div>
          <div>
            <ChevronDownIcon
              w={6}
              h={6}
              sx={{
                marginRight: "30px",
                cursor: "pointer",
                transition: "all .2s ease-in",
                transform: `rotate(${!isCollapsed ? "90" : 0}deg)`,
              }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
        </div>

        <div className={isCollapsed ? styles.collapsed : styles.expanded}>
          {!currentSession.currentUser.userID && !wspUsers.userWsps.length ? (
            <Stack
              style={{ width: "90%", marginTop: "10px", marginBottom: "10px" }}
            >
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            wspUsers.userWsps.map((todoWorkspace) => (
              <List spacing={3}>
                <ListItem
                  className={styles.buttonSpaceList}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    borderRadius: "10px",
                    justifyContent: "space-between",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    alignItems: " center",
                    color: "#1C1C1C",
                    fontWeight:
                      currentSelected === todoWorkspace._id
                        ? "bolder"
                        : "normal",
                  }}
                  onClick={() => {
                    setCurrentSelected(todoWorkspace._id);
                    currentWorkSpace.setCurrentWorkSpace(todoWorkspace);
                    setWorkSpaceFlow(todoWorkspace.type);
                  }}
                >
                  <div>
                    <ListIcon
                      as={ArrowForwardIcon}
                      sx={{ marginBottom: "2px", marginRight: "15px" }}
                    />
                    {todoWorkspace.type} {todoWorkspace.name}
                  </div>

                  <div style={{ display: "flex" }}>
                    <EditIcon
                      sx={{ marginRight: "15px", marginBottom: "5px" }}
                      onClick={() => {
                        setItem(todoWorkspace);
                        setOpenEdit(true);
                      }}
                    />
                    <DeleteIcon
                      sx={{ marginRight: "10px", marginBottom: "5px" }}
                      onClick={() => {
                        setItem(todoWorkspace);
                        setOpenDelete(true);
                      }}
                    />
                  </div>
                </ListItem>
              </List>
            ))
          )}
        </div>
      </div>

      <div className={styles.buttonSpace}>
        <ChatIcon sx={{ marginLeft: "20px", color: "#252525" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#252525",
            marginLeft: "5px",
            fontWeight: workspaceFlow == "chatUser" ? "bolder" : "normal",
          }}
          onClick={() => {
            setCurrentSelected("");
            setWorkSpaceFlow("chatUser");
          }}
        >
          Listado de contactos
        </button>
      </div>

      <div className={styles.buttonSpace}>
        <CalendarIcon sx={{ marginLeft: "20px", color: "#252525" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginLeft: "5px",
            color: "#1C1C1C",
            fontWeight: workspaceFlow == "calendarUser" ? "bolder" : "normal",
          }}
          onClick={() => {
            setCurrentSelected("");
            setWorkSpaceFlow("calendarUser");
          }}
        >
          Calendario
        </button>
      </div>

      <div className={styles.buttonSpace}>
        <StarIcon sx={{ marginLeft: "20px", color: "#252525" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginLeft: "5px",
            color: "#1C1C1C",
            fontWeight: workspaceFlow == "balanceUser" ? "bolder" : "normal",
          }}
          onClick={() => {
            setCurrentSelected("");
            setWorkSpaceFlow("balanceUser");
          }}
        >
          Mis Ingresos
        </button>
      </div>
    </>
  );
};

export default ToolButtons;
