import * as React from "react";
import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  measureTextCached,
  Rectangle,
} from "@glideapps/glide-data-grid";
import { roundedRect } from "../multipicklist/draw-fns";

import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import "react-phone-number-input/style.css";


interface TimePickerCellProps {
  readonly type: "phone";
  readonly phone: Date | undefined;
  readonly displayPhone: string;
}

const tagHeight = 25;
const innerPad = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TopEditor(p: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cell: any = p.value;
  const currentValue: string = cell.data.phone;

  return (
    <div style={{display: "flex", alignItems: "center", paddingTop: "9px", paddingLeft: "15px"}}>
      <PhoneInput
        placeholder="Ingresa tu numero"
        value={currentValue}
        onChange={(e) => {
          p.onChange({
            ...p.value,
            data: {
              ...p.value.data,
              phone: e ?? undefined,
            },
          });
        }}
      />
    </div>
  );
}

export type TimePickerCell = CustomCell<TimePickerCellProps>;

const renderer: CustomRenderer<TimePickerCell> = {
  kind: GridCellKind.Custom,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMatch: (cell: CustomCell): cell is TimePickerCell => { return (cell.data as any).type === "phone";},

  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { displayPhone } = cell.data;

    const drawArea: Rectangle = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    };
    const rows = Math.max(
      1,
      Math.floor(drawArea.height / (tagHeight + innerPad))
    );

    let x = drawArea.x;
    let row = 1;
    let y =
      drawArea.y +
      (drawArea.height - rows * tagHeight - (rows - 1) * innerPad) / 2;

    const color = displayPhone ? "#EEEEEE" : "transparent";
    const metrics = measureTextCached(displayPhone, ctx);
    const width = metrics.width + innerPad * 3;
    const textY = tagHeight / 2;

    if (
      x !== drawArea.x &&
      x + width > drawArea.x + drawArea.width &&
      row < rows
    ) {
      row++;
      y += tagHeight + innerPad;
      x = drawArea.x;
    }

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.font = `${500} ${13}px ${theme.fontFamily}`;
    roundedRect(ctx, x, y, width, tagHeight, tagHeight / 5);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillText(formatPhoneNumberIntl(displayPhone), x + innerPad, y + textY);

    x += width + 8;
    if (x > drawArea.x + drawArea.width && row >= rows) return;

    return true;
  },

  provideEditor: () => ({
    disablePadding: true,
    editor: TopEditor,
  }),
};

export default renderer;
