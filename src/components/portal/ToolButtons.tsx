import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { AttachmentIcon } from "@chakra-ui/icons";
import { ChatIcon, CalendarIcon, StarIcon } from "@chakra-ui/icons";

import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import { List, ListItem, ListIcon } from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import styles from "../../styles/ToolButtons.module.css";

import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

const ToolButtons = ({ workspaceFlow, setWorkSpaceFlow }) => {

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const wspUsers = useWorkspace();
  const currentWorkSpace = useCurrentWorkspace();


  return (
    <>
      <div style={{ marginTop: "10px" }}>
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
                backgroundColor: "#e2e2e2",
                border: "none",
                color: "#2d3b50",
                marginLeft: "5px",
                fontWeight: workspaceFlow == "wspUser" ? "bolder" : "normal",
              }}
              onClick={() => {
                setWorkSpaceFlow("wspUser");
              }}
            >
              Workspaces
            </button>
          </div>
          <div>
            {isCollapsed ? (
              <ChevronDownIcon
                w={6}
                h={6}
                sx={{ marginRight: "30px", cursor: "pointer" }}
                onClick={() => setIsCollapsed(!isCollapsed)}
              />
            ) : (
              <ChevronLeftIcon
                w={6}
                h={6}
                sx={{ marginRight: "30px", cursor: "pointer" }}
                onClick={() => setIsCollapsed(!isCollapsed)}
              />
            )}
          </div>
        </div>

        <div className={isCollapsed ? styles.collapsed : styles.expanded}>
          {wspUsers.userWsps.map((todoWorkspace) => (
            <List sx={{ transition: "all .5s" }} spacing={3}>
              <ListItem
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  currentWorkSpace.setCurrentWorkSpace(todoWorkspace)
                  setWorkSpaceFlow("todoWsp")}}
              >
                <ListIcon
                  as={EditIcon}
                  sx={{ marginBottom: "2px", marginRight: "15px" }}
                />
                {todoWorkspace.type} {todoWorkspace.name}
              </ListItem>
            </List>
          ))}
        </div>
      </div>

      <div>
        <ChatIcon sx={{ marginLeft: "20px" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "#e2e2e2",
            border: "none",
            color: "#2d3b50",
            marginLeft: "5px",
            fontWeight: workspaceFlow == "chatUser" ? "bolder" : "normal",
          }}
          onClick={() => setWorkSpaceFlow("chatUser")}
        >
          Listado de contactos
        </button>
      </div>

      <div>
        <CalendarIcon sx={{ marginLeft: "20px" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "#e2e2e2",
            border: "none",
            color: "#2d3b50",
            marginLeft: "5px",
            fontWeight: workspaceFlow == "calendarUser" ? "bolder" : "normal",
          }}
          onClick={() => setWorkSpaceFlow("calendarUser")}
        >
          Calendario
        </button>
      </div>

      <div>
        <StarIcon sx={{ marginLeft: "20px" }} />
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          style={{
            backgroundColor: "#e2e2e2",
            border: "none",
            color: "#2d3b50",
            marginLeft: "5px",
            fontWeight: workspaceFlow == "balanceUser" ? "bolder" : "normal",
          }}
          onClick={() => setWorkSpaceFlow("balanceUser")}
        >
          Mis Ingresos
        </button>
      </div>
    </>
  );
};

export default ToolButtons;
