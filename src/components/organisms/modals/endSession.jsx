import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";

const EndSession = (props) => {

  const nextRouterHook = useRouter()

  async function clearUserSessionCookie() {
    const tokenValue = await Cookies.get("tumbleToken");
    await Cookies.remove("tumbleToken", tokenValue);

    nextRouterHook.reload(window.location.pathname)
  }
  
  return (
    <>
      <AlertDialog isOpen={props.isOpen}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cerrar sesión.
            </AlertDialogHeader>

            <AlertDialogBody>
              Estas a punto de cerrar tu sesión en esta pagina.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => props.setIsOpen(false)}>Cancelar</Button>
              <Button colorScheme="red" onClick={clearUserSessionCookie} ml={3}>
                Salir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EndSession;
