import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@nextui-org/react";
import EditTask from "@/components/organisms/modals/EditTask";

const MiniCard = ({ item, bgColor }) => {
  const [isClicked, setIsClicked] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  return (
    <div
      style={{
        height: "max-content",
        backgroundColor: "white",
        marginBottom: "20px",
        padding: "15px",
        borderRadius: "10px",
        cursor: isClicked ? "default" : "pointer",
        border: isClicked ? "1px solid black" : "none",
      }}
    >
      <EditTask isOpen={openEdit} onClose={setOpenEdit} data={item} />
      {isClicked && (
        <div
          className="options"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            transition: "all .5s",
          }}
        >
          <button
            style={{
              marginRight: "15px",
            }}
          >
            <EditIcon onClick={() => setOpenEdit(true)} />
          </button>
          <button
            style={{
              marginRight: "5px",
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      )}
      <div onClick={() => setIsClicked(isClicked ? false : true)}>
        <p style={{ fontWeight: "bold" }}>{item.title}</p>
        <p>{item.info}</p>
        <div
          style={{
            height: "max-content",
            backgroundColor: bgColor,
            width: "max-content",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <p style={{ marginTop: "15px" }}>{item.status}</p>
        </div>
        <p style={{ marginTop: "5px" }}>Fecha de inicio: {item.createdDate}</p>
      </div>
    </div>
  );
};

export default MiniCard;
