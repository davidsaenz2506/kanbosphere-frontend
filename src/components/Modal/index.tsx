import React, { ReactNode } from "react";
import { Modal } from "@nextui-org/react";

interface IModalProps {
  isOpen: boolean;
  content?: ReactNode;
}

const ModalComponent: React.FunctionComponent<IModalProps> = ({
  isOpen,
  content,
}) => {
  return (
    <React.Fragment>
      <Modal open={isOpen} style={{ backgroundColor: "transparent" }}>
        <Modal.Body>{content}</Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ModalComponent;
