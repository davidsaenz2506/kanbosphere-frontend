import React, { useState } from "react";
import ToDoLanes from "../../../components/Lane/ToDoLanes";

import AddTask from "../../../components/Modals/AddTask";

import { useCurrentWorkspace } from "@/context/currentWorkSpace/currentWsp.hook";
import Header from "../../../components/Header/Header";
import { Box, Portal, useToast } from "@chakra-ui/react";
import { IDataToDo, IFilePath } from "@/domain/entities/todo.entity";

import EditTask from "@/components/Modals/EditTask";
import DeleteTask from "@/components/Modals/DeleteTask";
import Loading from "@/components/Loading";

import { storage } from "@/storage/firebaseClient";
import {
  StorageReference,
  getDownloadURL,
  ref as refStorageObject,
} from "firebase/storage";
import SlideTask from "@/components/SlideTask";
import { useRouter } from "next/router";
import { useWorkspace } from "@/context/usersWorkSpaces/wsp.hook";
import { IWspUser } from "@/domain/entities/userWsps.entity";

const ToDoWorkspace = () => {
  const [addTask, setAddTask] = useState(false);
  const bodyDocument: HTMLBodyElement | null = document.querySelector("body");
  const { userWsps } = useWorkspace();
  const { currentWorkSpace, setCurrentWorkSpace } = useCurrentWorkspace();
  const [currentColor, setCurrentColor] = useState<string>("#FAFAFA");
  const [isGettingImage, setIsGettingImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOrDeleting, setIsSendingOrDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSliderTask, setOpenSliderTask] = useState(true);
  const isBrowser = () => typeof window !== "undefined";
  const colorObject = {
    "Default color": "#FAFAFA",
    Bone: "#F8F8F8",
    Marfil: "#FAFAFA",
  };
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<IDataToDo | undefined>();

  const toastNotification = useToast();
  const [stringPathToRender, setStringPathToRender] = useState<IFilePath[]>([]);
  const router = useRouter();

  const statusColorValues = {
    New: "#FF5733",
    "In Proccess": "#FFC300",
    "For Review": "#6FB98F",
    Finished: "#4B0082",
    Blocked: "#FF3333",
  };

  if (isBrowser()) {
    window.onresize = function onResize() {
      const todoDocument: HTMLDivElement | null =
        document.querySelector(".todoContainer");
      const navBarDocument: any = document.getElementById("navbarHome");
      const bodyDocumentData: HTMLBodyElement | null =
        document.querySelector("body");

      const workSpaceContainer = document.getElementById("workSpace");

      const resizetToolData: HTMLElement | null =
        document.getElementById("resizerTool");

      if (
        todoDocument &&
        bodyDocument &&
        bodyDocumentData &&
        resizetToolData &&
        workSpaceContainer
      ) {
        todoDocument.style.height = `${
          bodyDocument.getBoundingClientRect().height -
          navBarDocument.getBoundingClientRect().height
        }px`;
      }
    };
  }

  React.useEffect(() => {
     const relatedWorkspace: IWspUser[] = userWsps.filter((currentRecord: IWspUser) => currentRecord._id === router.query?.fridgeKey)
     setCurrentWorkSpace(relatedWorkspace[0])
  }, [router.query?.fridgeKey])

  React.useEffect(() => {
    const InitialTodoDocument: HTMLDivElement | null =
      document.querySelector(".todoContainer");
    const InitialNavBarDocument: any = document.getElementById("navbarHome");

    if (InitialTodoDocument && bodyDocument) {
      InitialTodoDocument.style.height = `${
        bodyDocument.getBoundingClientRect().height -
        InitialNavBarDocument.getBoundingClientRect().height
      }px`;
    }
  });

  React.useEffect(() => {
    setStringPathToRender([]);

    if (selectedTask?.file && selectedTask?.file?.length > 0) {
      const currentStorageRefsMatrix: StorageReference[] = [];
      for (const currentPathObject of selectedTask?.file) {
        const storageRef: StorageReference = refStorageObject(
          storage,
          currentPathObject.relativePath
        );
        currentStorageRefsMatrix.push(storageRef);
      }

      getFileDataFromFirebase(currentStorageRefsMatrix);
    }
  }, [selectedTask?.file]);

  async function getFileDataFromFirebase(
    currentStorageRefsMatrix: StorageReference[]
  ) {
    const currentUrlData: IFilePath[] = [];
    setIsGettingImage(true);
    try {
      for (const currentFileRef of currentStorageRefsMatrix) {
        const downloadUrl: string = await getDownloadURL(currentFileRef);
        currentUrlData.push({
          name: currentFileRef.name,
          relativePath: downloadUrl,
        });
      }
      setStringPathToRender(currentUrlData);
      setIsGettingImage(false);
    } catch (error) {
      setIsGettingImage(false);
      toastNotification({
        title: "Ups, algo ha ocurrido...",
        description: "Error al obtener datos, intentalo de nuevo más tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  React.useEffect(() => {
    setSelectedTask(
      currentWorkSpace?.wspData?.filter(
        (currentRecord) =>
          currentRecord?.taskId ===
          currentWorkSpace?.wspDataPreferences?.selectedTask
      )[0]
    );
  }, [currentWorkSpace]);

  return (
    <>
      <EditTask
        isOpen={openEdit}
        onClose={setOpenEdit}
        data={selectedTask}
        isLoading={isSendingOrDeleting}
        setIsLoading={setIsSendingOrDeleting}
      />
      <DeleteTask
        isOpen={openDelete}
        onClose={setOpenDelete}
        //@ts-ignore
        data={selectedTask}
        isLoading={isSendingOrDeleting}
        setIsLoading={setIsSendingOrDeleting}
      />
      <Box
        className="todoContainer"
        style={{
          backgroundColor: currentColor,
          display: "flex",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <AddTask
          isOpen={addTask}
          onClose={setAddTask}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Box
          width={isOpenSliderTask ? "60%" : "100%"}
          transition={"all .3s ease"}
          css={{
            "&::-webkit-scrollbar": {
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#D3D3D3",
              borderRadius: "4px",
            },
          }}
          overflowX={"scroll"}
          overflowY={"hidden"}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              height: "12%",
              left: 0,
            }}
          >
            <Header
              currentWorkSpace={currentWorkSpace}
              setAddTask={setAddTask}
              setCurrentColor={setCurrentColor}
              currentColor={currentColor}
              setIsOpen={setIsOpen}
              colorObject={colorObject}
              isOpen={isOpen}
              isOpenSliderTask={isOpenSliderTask}
              setOpenSliderTask={setOpenSliderTask}
            />
          </Box>
          <Box style={{ height: "90%" }}>
            <ToDoLanes
              isGettingImage={isGettingImage}
              setSelectedTasks={setSelectedTask}
            />
          </Box>
        </Box>

        <SlideTask
          isGettingImage={isGettingImage}
          isOpenSliderTask={isOpenSliderTask}
          selectedTask={selectedTask}
          setOpenDelete={setOpenDelete}
          setOpenEdit={setOpenEdit}
          statusColorValues={statusColorValues}
          stringPathToRender={stringPathToRender}
        />
      </Box>
    </>
  );
};

export default ToDoWorkspace;
