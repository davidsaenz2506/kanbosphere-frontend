import * as React from "react";
import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  measureTextCached,
  Rectangle,
} from "@glideapps/glide-data-grid";
import { roundedRect } from "../multipicklist/draw-fns";

interface DatePickerCellProps {
  readonly kind: "date";
  readonly date: Date | undefined;
  readonly displayDate: string;
  readonly format: "date" | "datetime-local";
}

const tagHeight = 25;
const innerPad = 12;

export type DatePickerCell = CustomCell<DatePickerCellProps>;

const renderer: CustomRenderer<DatePickerCell> = {
  kind: GridCellKind.Custom,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMatch: (cell: CustomCell): cell is DatePickerCell => {
    return (cell.data as any).type === "date";
  },

  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { displayDate } = cell.data;

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

    const color = "#EEEEEE";
    const metrics = measureTextCached(displayDate, ctx);
    const width = metrics.width + innerPad * 2;
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
    ctx.fillText(displayDate, x + innerPad, y + textY);

    x += width + 8;
    if (x > drawArea.x + drawArea.width && row >= rows) return;

    return true;
  },

  provideEditor: () => (p) => {
    const cellData = p.value.data;
    const { format, date } = cellData;

    let val = "";
    if (date !== undefined) {
      val = new Date(date).toISOString();

      if (format === "date") {
        val = val.split("T")[0];
      }
    }

    return (
      <input
        style={{ minHeight: 26, border: "none", outline: "none" }}
        type={format}
        autoFocus={true}
        value={val}
        onChange={(e) => {
          p.onChange({
            ...p.value,
            data: {
              ...p.value.data,
              date: e.target.valueAsDate ?? undefined,
            },
          });
        }}
      />
    );
  },
};

export default renderer;
