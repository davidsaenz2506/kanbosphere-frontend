import React from "react";
import { Button, Modal, Text, Image } from "@nextui-org/react";

const FileViewer = ({
  openModalForFiles,
  setOpenModalForFiles,
  pathImage,
  deleteFileFromDirectory,
}) => {
  return (
    <React.Fragment>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={openModalForFiles}
        onClose={() => setOpenModalForFiles(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Eliminar imagen
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Image style={{ borderRadius: "20px" }} src={pathImage?.relativePath} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setOpenModalForFiles(false)}
            auto
            flat
            color="error"
          >
            Close
          </Button>
          <Button onClick={() => deleteFileFromDirectory(pathImage?.index)} auto>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default FileViewer;
