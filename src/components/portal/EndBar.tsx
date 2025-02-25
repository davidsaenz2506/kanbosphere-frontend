import React, { useState } from "react";

import { Icon } from "@chakra-ui/icons";
import { CiSettings } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";

import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";

import EndSession from "../Modals/EndSession";
import styles from "../../styles/ToolButtons.module.css";
import { Box, Button, Divider } from "@chakra-ui/react";
import { useLoadingChunk } from "@/context/loadingChunks/loadingChunk.hook";
import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";

function delayTime(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface IEndBarProps {
  setIsTriggerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const EndBar: React.FunctionComponent<IEndBarProps> = (props) => {
  const { setIsTriggerActive } = props;
  const { setCurrentWorkSpace } = useCurrentWorkspace();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { loadingChunk } = useLoadingChunk();

  async function handleRouterPath(caseUrl: string) {
    setIsTriggerActive(true);

    setCurrentWorkSpace(undefined);
    router.push(`/dashboard?briefcase=${caseUrl}`);
    await delayTime(200);

    setIsTriggerActive(false);
  }

  return (
    <>
      <EndSession isOpen={isOpen} setIsOpen={setIsOpen} />
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          paddingBottom: "10px",
          color: "#252525",
          backgroundColor: "#ffffff",
          width: "70px",
        }}
      >
        <Divider width={"70%"} marginLeft={"10px"} marginBottom={"10px"} />
        <Box className={styles.buttonSpace}>
          <Button
            type="button"
            disabled={loadingChunk}
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",

              fontSize: "15px",
            }}
            onClick={() => {
              const caseUrl: string = "settings";
              handleRouterPath(caseUrl);
            }}
          >
            <Icon marginLeft={"-5px"} as={CiSettings} w={6} h={6} />
          </Button>
        </Box>
        <Box className={styles.buttonSpace}>
          <Button
            type="button"
            disabled={loadingChunk}
            className="btn btn-secondary btn-lg btn-block"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#1C1C1C",

              fontSize: "15px",
            }}
            onClick={() => {
              setCurrentWorkSpace(undefined);
              setIsOpen(true);
            }}
          >
            <Icon as={IoExitOutline} w={5} h={5} />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EndBar;
