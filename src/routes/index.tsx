import UserWorkSpace from "@/components/UserWorkspace/UserWorkSpace";
import { BalanceUser } from "@/pages/dashboard/balance";
import UserConfig from "@/pages/dashboard/config/UserConfig";
import { ContactUser } from "@/pages/dashboard/contact";
import ToDoWorkspace from "@/pages/dashboard/kanban";
import { MainLoad } from "@/pages/dashboard/main";
import Spreadsheet from "@/pages/dashboard/spreadsheet";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { ReactNode } from "react";

export const renderComponent = (
  query: ParsedUrlQuery,
  loadingServerData: boolean
): ReactNode => {
  const briefCase: string | string[] | undefined = query.briefcase;

  switch (briefCase) {
    case "main":
      return <MainLoad loadingServerData={loadingServerData} />;
    case "create":
      return <UserWorkSpace />;
    case "agile":
      return <ToDoWorkspace />;
    case "spreadsheet":
      return <Spreadsheet />;
    case "friends":
      return <ContactUser />;
    case "balance":
      return <BalanceUser />;
    case "settings":
      return <UserConfig />;
    default:
      return <MainLoad loadingServerData={loadingServerData} />;
  }
};
