import React, { useState } from "react";

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
              <Button
                colorScheme="red"
                onClick={() => props.router.replace("/")}
                ml={3}
              >
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
