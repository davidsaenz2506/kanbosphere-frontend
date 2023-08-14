import {
  CustomCell,
  Rectangle,
  measureTextCached,
  CustomRenderer,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import { roundedRect } from "./draw-fns";
import { Checkbox, Tag } from "@chakra-ui/react";

interface TagsCellProps {
  readonly kind: "multipicklist";
  readonly tags: readonly string[];
  readonly readonly?: boolean;
  readonly possibleTags: readonly {
    value: string;
    label: string;
    color: string;
  }[];
}

export type TagsCell = CustomCell<TagsCellProps>;

const tagHeight = 25;
const innerPad = 12;

const renderer: CustomRenderer<TagsCell> = {
  kind: GridCellKind.Custom,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isMatch: (c): c is TagsCell => (c.data as any).type === "multipicklist",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { possibleTags, tags } = cell.data;

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
    for (const tag of tags) {
      const color = possibleTags.find((t) => t.label === tag)?.color ?? theme.bgBubble;
      const metrics = measureTextCached(tag, ctx);
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
      ctx.fillText(
        tag,
        x + innerPad,
        y + textY
      );

      x += width + 8;
      if (x > drawArea.x + drawArea.width && row >= rows) break;
    }

    return true;
  },
  provideEditor: () => {
    return (p) => {
      const { onChange, value } = p;
      const { possibleTags, tags, readonly = false } = value.data;
      return (
        <React.Fragment>
          {possibleTags.map((t) => {
            const selected = tags.indexOf(t.label) !== -1;
            return (
              <label
                key={t.value}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "40px",
                }}
              >
                {!readonly && (
                  <Checkbox
                    className="gdg-input"
                    style={{ width: "5%" }}
                    iconColor="white"
                    colorScheme="purple"
                    isChecked={selected}
                    onChange={() => {
                      const newTags = selected
                        ? tags.filter((x) => x !== t.value)
                        : [...tags, t.value];
                      onChange({
                        ...p.value,
                        data: {
                          ...value.data,
                          tags: newTags,
                        },
                      });
                    }}
                  />
                )}
                <Tag
                  className={"pill " + (selected ? "selected" : "unselected")}
                  style={{
                    backgroundColor: selected ? t.color : "transparent",
                    width: "95%",
                    textAlign: "start",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "10px",
                    marginRight: "10px",
                    transition: "all .3s",
                    cursor: "pointer",
                  }}
                >
                  {t.value}
                </Tag>
              </label>
            );
          })}
        </React.Fragment>
      );
    };
  },
  onPaste: (v, d) => ({
    ...d,
    tags: d.possibleTags
      .map((x) => x.value)
      .filter((x) =>
        v
          .split(",")
          .map((s) => s.trim())
          .includes(x)
      ),
  }),
};

export default renderer;
