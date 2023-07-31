import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface IQuillEditorProps {
  value: string;
  style?: React.CSSProperties;
  readOnly: boolean;
  onChangeMethod?: React.Dispatch<React.SetStateAction<string>>;
  modules: any;
}

const QuillEditor: React.FC<IQuillEditorProps> = (props) => {
  const { value, style, readOnly, onChangeMethod, modules } = props;

  return (
    <ReactQuill
      style={style}
      value={value}
      readOnly={readOnly}
      onChange={(value: string) => {
        if (onChangeMethod) onChangeMethod(value);
      }}
      modules={modules}
    />
  );
};

export default QuillEditor;
