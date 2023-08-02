import { ISelectColorOptions } from "@/components/Modals/AddColumn";
import {
  CustomCell,
  ProvideEditorCallback,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import Select, { MenuProps, components } from "react-select";

import chroma from 'chroma-js';

interface CustomMenuProps extends MenuProps<any> {}

const CustomMenu: React.FC<CustomMenuProps> = (p) => {
  const { Menu } = components;
  const { children, ...rest } = p;
  return <Menu {...rest}>{children}</Menu>;
};

interface DropdownCellProps {
  readonly kind: "picklist";
  readonly value: string;
  readonly allowedValues: readonly ISelectColorOptions[];
  readonly readonly?: boolean;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

const Editor: ReturnType<ProvideEditorCallback<DropdownCell>> = (p) => {
  const { value: cell, onFinishedEditing, initialValue } = p;
  const { allowedValues, value: valueIn } = cell.data;

  const [value, setValue] = React.useState(valueIn);
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");

  const values = React.useMemo(
    () =>
      allowedValues.map((x) => ({
        value: x.value,
        label: x.label,
        color: x.color,
      })),
    [allowedValues]
  );

  return (
    <Select
      className="glide-select"
      inputValue={inputValue}
      onInputChange={setInputValue}
      menuPlacement={"auto"}
      value={values.find((x) => x.value === value)}
      styles={{
        control: (base) => ({
          ...base,
          border: 0,
          boxShadow: "none"
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          const color = chroma("rgba(33,42,62,1)");
          return {
            ...styles,
            backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? "rgba(33,42,62,1)"
            : isFocused
            ? color.alpha(0.2).css()
            : undefined,
          };
        },
      }}
      menuPortalTarget={document.getElementById("portal")}
      autoFocus={true}
      openMenuOnFocus={true}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        Menu: (props) => (
          <CustomMenu className={"click-outside-ignore"} {...props} />
        ),
      }}
      options={values}
      onChange={async (e) => {
        if (e === null) return;
        setValue(e.value);
        await new Promise((r) => window.requestAnimationFrame(r));
        onFinishedEditing({
          ...cell,
          data: {
            ...cell.data,
            value: e.value,
          },
        });
      }}
    />
  );
};

const renderer: CustomRenderer<DropdownCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is DropdownCell => (c.data as any).type === "picklist",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    ctx.fillStyle = theme.textDark;
    ctx.fillText(
      value,
      rect.x + theme.cellHorizontalPadding,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
    );

    return true;
  },
  provideEditor: () => ({
    editor: Editor,
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: "",
      data: {
        ...v.data,
        value: "",
      },
    }),
  }),
};

export default renderer;
