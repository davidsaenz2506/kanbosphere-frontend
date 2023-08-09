import * as React from "react";
import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  measureTextCached,
  Rectangle,
} from "@glideapps/glide-data-grid";
import { roundedRect } from "../multipicklist/draw-fns";
import Calculator from "@/components/Calculator/components/App/App";

interface TimePickerCellProps {
  readonly type: "calculator";
  readonly displayData: string;
  readonly data: number;
}

const tagHeight = 25;
const innerPad = 2;

function TopEditor(p: any) {
  const currentContentBoxElement: HTMLElement | null = document.getElementById("fylent-grid-engine");
  const currentClipRegionElement: HTMLElement | null = document.querySelector(".clip-region");
  const boundingClientRect: DOMRect | undefined = currentContentBoxElement?.getBoundingClientRect();
  const currentRectHeight: number | undefined = boundingClientRect?.height;
  const currentDataResult: number = p.value.data.data ?? 0;
  const [currentTriggerPointer, setCurrentTriggerPointer] = React.useState<number>(0);

  if (currentRectHeight && currentRectHeight - p.target.y < currentRectHeight - 472) p.target.y = p.target.y - 472;
  if (currentClipRegionElement) currentClipRegionElement.style.overflowY = "hidden"

  setTimeout(() => {
        setCurrentTriggerPointer(1);
  }, 50)

  return (
    <div
      id="currentContentBox"
      style={{
        display: "flex",
        alignItems: "center",
        minWidth: "300px",
        borderRadius: "5px",
        transition: "all .1s",
        transform: currentTriggerPointer ? "scale(1)" : "scale(0)"
      }}
    >
      <Calculator
        currentResult={currentDataResult}
        onChange={(e) => {
          p.onChange({
            ...p.value,
            data: {
              ...p.value.data,
              data: e ?? undefined,
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
  isMatch: (cell: CustomCell): cell is TimePickerCell => {
    return (cell.data as any).type === "calculator";
  },

  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { displayData } = cell.data;

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

    const color = "transparent";
    const metrics = measureTextCached(displayData, ctx);
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
    ctx.fillText(isNaN(parseInt(displayData, 10)) ? "" : parseInt(displayData, 10).toString(), x + innerPad, y + textY);

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
