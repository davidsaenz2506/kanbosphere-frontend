import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";

import {
  Box,
  Divider,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import TableAgile from "../Tables/Agile";

import { useCurrentUser } from "@/context/currentUser/currentUser.hook";

import styles from "../../pages/dashboard/main/main.module.css"

const Projections = ({ loadingServerData }) => {
  const currentWorkspaces = useWorkspace();
  const currentSession = useCurrentUser();
  const agileSpaceChunkData = currentWorkspaces.userWsps;

  return (
    <Box className={styles.projectionData} height={"100%"}>
      <Box padding={"20px"}>
        {!loadingServerData ? (
          <Stack marginBottom={"20px"}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <Text fontSize={"20px"} marginBottom={"20px"}>
            Gestión de proyectos / {currentSession.currentUser.fullname}
          </Text>
        )}

        <Divider marginBottom={"15px"} />
        <Stack spacing={4} display={"flex"} flexDirection={"column"}>
          <Box>
            {!loadingServerData ? (
              <Box padding="6" boxShadow="lg" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText
                  mt="4"
                  noOfLines={4}
                  spacing="4"
                  skeletonHeight="2"
                />
              </Box>
            ) : (
              <>
                <Box
                  border={"1px solid transparent"}
                  borderRadius={"10px"}
                  overflowY={"hidden"}
                >
                  <TableAgile agileSpaceChunkData={agileSpaceChunkData} />
                </Box>
              </>
            )}
            <Divider marginTop={"15px"} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Projections;
