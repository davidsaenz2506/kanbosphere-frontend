import React from "react";
import UserConfig from "./config/UserConfig";
import UserWorkSpace from "./individualWsp/UserWorkSpace";

import ToDoWorkSpace from "./todoWsp/ToDoWorkspace";
import Spreadsheet from "./spreadSheet/SpreadSheet";
import { MainLoad } from "@/components/portal/MainLoad";

const WorkspaceManager = ({ workspaceFlow }) => {
  return (
    <>
      {(workspaceFlow === "mainMenu" || workspaceFlow === "") && <MainLoad />}
      {workspaceFlow === "wspUser" && <UserWorkSpace />}
      {workspaceFlow === "To Do" && <ToDoWorkSpace />}
      {workspaceFlow === "Tumble Spreadsheet" && <Spreadsheet />}
      {workspaceFlow === "chatUser" && <h1>Contact User</h1>}
      {workspaceFlow === "calendarUser" && <h1>Calendar User</h1>}
      {workspaceFlow === "balanceUser" && <h1>Balance User</h1>}
      {workspaceFlow === "userConfig" && <UserConfig />}
    </>
  );
};

export default WorkspaceManager;
