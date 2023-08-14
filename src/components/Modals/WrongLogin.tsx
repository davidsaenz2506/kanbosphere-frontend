import React, { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";

interface IWrongLoginProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const WrongLoginComponent: React.FunctionComponent<IWrongLoginProps> = (props) => {
  const ref = useRef(null);

  return (
    <>
      <AlertDialog
        leastDestructiveRef={ref}
        isOpen={props.isOpen}
        onClose={() => props.onClose(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hubo un error al iniciar sesión
            </AlertDialogHeader>

            <AlertDialogBody>
              Comprueba tus credenciales e intentalo de nuevo.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => props.onClose(false)}>Aceptar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default WrongLoginComponent;
