import React from "react";
import UserConfig from "./config/UserConfig";
import UserWorkSpace from "./individualWsp/UserWorkSpace";

import ToDoWorkSpace from "./todoWsp/ToDoWorkspace";
import Spreadsheet from "./spreadSheet/SpreadSheet";
import { MainLoad } from "@/components/portal/MainLoad";
import { ContactUser } from "@/components/portal/ContactUser";
import { CalendaryUser } from "@/components/portal/Calendary";
import { BalanceUser } from "@/components/portal/Balance";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { getUpdatedServerWorkspaces } from "@/services/bidirectional/workspaces";
import currentBiridectionalCommunication from "@/services/socket";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { getUpdatedUserData } from "@/services/bidirectional/users";

import Cookies from "universal-cookie";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";

const WorkspaceManager = ({ workspaceFlow }) => {
  const currentSession = useCurrentUser();
  const currentContacts = useCurrentContact();
  const workspacesOperations = useWorkspace();
  const [dischargeStabilizerPointer, setDischargeStabilizerPointer] =
    React.useState(0);

  setTimeout(() => {
    setDischargeStabilizerPointer(dischargeStabilizerPointer + 5);
  }, 10000);

  React.useEffect(() => {
    if (currentSession.currentUser.userID) {
      getUpdatedWorkspace(currentSession.currentUser.userID);
    }
  }, [dischargeStabilizerPointer]);
  

  async function getUpdatedWorkspace(userId: string) {
    await getUpdatedServerWorkspaces(userId, {
      roomToken: currentSession.currentUser._id,
    });
    await getUpdatedUserData(userId, {
      roomToken: currentSession.currentUser._id,
    });

    currentBiridectionalCommunication.emit(
      "joinToRoom",
      currentSession.currentUser._id
    );

    currentBiridectionalCommunication.on("currentDataUpdated", (response) => {
      if (response) workspacesOperations.setUsersWsps(response);
    });
    currentBiridectionalCommunication.on("currentUserUpdated", (response) => {
      if (response) {
        currentSession.setCurrentUser(response[0]);
        currentContacts.setCurrentContacts(response[1]);
      }
    });
  }

  return (
    <>
      {(workspaceFlow === "mainMenu" || workspaceFlow === "") && <MainLoad />}
      {workspaceFlow === "wspUser" && <UserWorkSpace />}
      {workspaceFlow === "To Do" && <ToDoWorkSpace />}
      {workspaceFlow === "Tumble Spreadsheet" && <Spreadsheet />}
      {workspaceFlow === "chatUser" && <ContactUser />}
      {workspaceFlow === "calendarUser" && <CalendaryUser />}
      {workspaceFlow === "balanceUser" && <BalanceUser />}
      {workspaceFlow === "userConfig" && <UserConfig />}
    </>
  );
};

export default WorkspaceManager;
