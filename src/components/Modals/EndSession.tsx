import React from "react";
import Cookies from "js-cookie";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";

interface IEndSessionProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EndSession: React.FunctionComponent<IEndSessionProps> = (props) => {
  async function clearUserSessionCookie() {
    window.open("/", "_self");
    const tokenValue = await Cookies.get("tumbleToken");
    await Cookies.remove("tumbleToken", tokenValue);
  }

  return (
    <>
      <AlertDialog isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader marginBottom={"-15px"} fontSize="lg" fontWeight="bold">
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
