import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import EditTask from "@/components/organisms/modals/EditTask";
import { DateTime } from "luxon";
import DeleteTask from "../../../modals/DeleteTask";
import { useOutsideClick } from "@chakra-ui/react";
import { IDataToDo } from "@/domain/entities/todo.entity";

interface IMiniCardProps {
  item: IDataToDo;
  key: number;
  targetColor: string;
}

const MiniCard = (Props: IMiniCardProps) => {
  const { item, key, targetColor } = Props;
  const [isClicked, setIsClicked] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const ref: any = React.useRef();
  useOutsideClick({
    ref: ref,
    handler: () => setIsClicked(false),
  });

  return (
    <div
      ref={ref}
      key={key}
      style={{
        height: "max-content",
        backgroundColor: "white",
        marginBottom: "20px",
        padding: "15px",
        borderRadius: "5px",
        cursor: isClicked ? "default" : "pointer",
        border: isClicked ? "1px solid black" : "none",
      }}
    >
      <EditTask isOpen={openEdit} onClose={setOpenEdit} data={item} />
      <DeleteTask isOpen={openDelete} onClose={setOpenDelete} data={item} />
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
            <DeleteIcon onClick={() => setOpenDelete(true)} />
          </button>
        </div>
      )}
      <div onClick={() => setIsClicked(isClicked ? false : true)}>
        <p style={{ fontWeight: "bold" }}>{item.title}</p>
        <p>{item.info}</p>
        <div
          style={{
            height: "max-content",
            backgroundColor: targetColor,
            width: "max-content",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <p style={{ marginTop: "15px" }}>{item.status}</p>
        </div>
        <p style={{ marginTop: "5px" }}>
          <strong> Fecha de inicio: </strong>
          {DateTime.fromISO(item.createDate).setLocale("es").toFormat("DDD")}
        </p>
        {item.finishDate && (
          <p style={{ marginTop: "5px" }}>
            <strong> Fecha de finalización: </strong>
            {DateTime.fromISO(item.finishDate).setLocale("es").toFormat("DDD")}
          </p>
        )}
      </div>
    </div>
  );
};

export default MiniCard;
