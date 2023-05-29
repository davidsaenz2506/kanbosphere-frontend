import React from "react";
import UserConfig from "./config/UserConfig";
import UserWorkSpace from "./individualWsp/UserWorkSpace";

import ToDoWorkSpace from "./todoWsp/ToDoWorkspace";
import Spreadsheet from "./spreadSheet/SpreadSheet";
import { MainLoad } from "@/components/portal/MainLoad";
import { ContactUser } from "@/components/portal/ContactUser";
import { CalendaryUser } from "@/components/portal/Calendary";
import { BalanceUser } from "@/components/portal/Balance";

const WorkspaceManager = ({ workspaceFlow }) => {
  return (
    <>
      {(workspaceFlow === "mainMenu" || workspaceFlow === "") && <MainLoad />}
      {workspaceFlow === "wspUser" && <UserWorkSpace />}
      {workspaceFlow === "To Do" && <ToDoWorkSpace />}
      {workspaceFlow === "Tumble Spreadsheet" && <Spreadsheet />}
      {workspaceFlow === "chatUser" && <ContactUser/>}
      {workspaceFlow === "calendarUser" && <CalendaryUser/>}
      {workspaceFlow === "balanceUser" && <BalanceUser/>}
      {workspaceFlow === "userConfig" && <UserConfig />}
    </>
  );
};

export default WorkspaceManager;
