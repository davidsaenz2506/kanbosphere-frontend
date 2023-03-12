import React from "react";
import UserConfig from "./config/UserConfig";
import UserWorkSpace from "./individualWsp/UserWorkSpace"

import ToDoWorkSpace from "./todoWsp/ToDoWorkspace"

const WorkspaceManager = ({ workspaceFlow }) => {
  return (
    <>
      {workspaceFlow === 'wspUser' && <UserWorkSpace/>}
      {workspaceFlow === 'todoWsp' && <ToDoWorkSpace />}
      {workspaceFlow === 'chatUser' && <h1>Contact User</h1>}
      {workspaceFlow === 'calendarUser' && <h1>Calendar User</h1>}
      {workspaceFlow === 'balanceUser' && <h1>Balance User</h1>}
      {workspaceFlow === 'userConfig' && <UserConfig/>}
    </>
  );
};

export default WorkspaceManager;
