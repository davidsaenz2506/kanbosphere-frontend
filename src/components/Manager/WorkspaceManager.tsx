import React from "react";
import UserConfig from "../../pages/dashboard/config/UserConfig";
import UserWorkSpace from "../UserWorkspace/UserWorkSpace";

import ToDoWorkSpace from "../../pages/dashboard/kanban";
import Spreadsheet from "@/pages/dashboard/spreadsheet";
import { MainLoad } from "../../../src/pages/dashboard/main";
import { ContactUser } from "@/pages/dashboard/contact";
import { CalendaryUser } from "@/pages/dashboard/calendar";
import { BalanceUser } from "@/pages/dashboard/balance";
import { useCurrentUser } from "@/context/currentUser/currentUser.hook";
import { getUpdatedServerWorkspaces } from "@/services/bidirectional/workspaces";
import currentBiridectionalCommunication from "@/services/socket";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { getUpdatedUserData } from "@/services/bidirectional/users";
import { useCurrentContact } from "@/context/currentContacts/currentContacts.hook";

import { useRouter } from 'next/router';

const WorkspaceManager = ({ workspaceFlow }) => {
  const currentSession = useCurrentUser();
  const currentContacts = useCurrentContact();
  const workspacesOperations = useWorkspace();
  const router = useRouter()



  const currentRoute = router.pathname.split('/').pop() ?? "";

  const CurrentComponent = MainLoad;

  return <CurrentComponent/>;
};

export default WorkspaceManager;
