import * as React from "react";
import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  measureTextCached,
  Rectangle,
} from "@glideapps/glide-data-grid";
import { roundedRect } from "../multipicklist/draw-fns";
import TimeKeeper from "react-timekeeper";
import { Box } from "@chakra-ui/react";

interface TimePickerCellProps {
  readonly type: "time";
  readonly time: Date | undefined;
  readonly displayTime: string;
}

const tagHeight = 25;
const innerPad = 12;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TopEditor(p: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cell: any = p.value;
  const currentValue: string = cell.data.time;

  return (
    <Box border={"2px solid #d9d9e3"} borderRadius={"4px"} maxW={"264px"} zIndex={10000}>
      <TimeKeeper
        time={currentValue}
        onChange={(e) => {
          p.onChange({
            ...p.value,
            data: {
              ...p.value.data,
              date: e.formatted12 ?? undefined,
            },
          });
        }}
      />
    </Box>
  );
}

export type TimePickerCell = CustomCell<TimePickerCellProps>;

const renderer: CustomRenderer<TimePickerCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is TimePickerCell => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (cell.data as any).type === "time";
  },

  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { displayTime } = cell.data;

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
    const metrics = measureTextCached(displayTime, ctx);
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
    ctx.fillText(displayTime, x + innerPad, y + textY);

    x += width + 8;
    if (x > drawArea.x + drawArea.width && row >= rows) return;

    return true;
  },

  provideEditor: () => ({
    disablePadding: true,
    disableStyling: true,
    editor: TopEditor,
  }),
};

export default renderer;
