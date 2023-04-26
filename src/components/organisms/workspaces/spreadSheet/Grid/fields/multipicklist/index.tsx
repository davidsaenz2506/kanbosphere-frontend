import {
  CustomCell,
  Rectangle,
  measureTextCached,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import { roundedRect } from "./draw-fns";
import { m } from "framer-motion";

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

const tagHeight = 20;
const innerPad = 10;

const renderer: CustomRenderer<TagsCell> = {
  kind: GridCellKind.Custom,
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
      const color =
        possibleTags.find((t) => t.label === tag)?.color ?? theme.bgBubble;

      ctx.font = `12px ${theme.fontFamily}`;
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
      roundedRect(ctx, x, y, width, tagHeight, tagHeight / 2);
      ctx.fill();

      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        tag,
        x + innerPad,
        y + textY + getMiddleCenterBias(ctx, `12px ${theme.fontFamily}`)
      );

      x += width + 8;
      if (x > drawArea.x + drawArea.width && row >= rows) break;
    }

    return true;
  },
  provideEditor: () => {
    // eslint-disable-next-line react/display-name
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
                  <input
                    className="gdg-input"
                    style={{ width: "5%" }}
                    type="checkbox"
                    checked={selected}
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
                <div
                  className={"pill " + (selected ? "selected" : "unselected")}
                  style={{
                    backgroundColor: selected ? t.color : undefined,
                    width: "95%",
                    borderRadius: "10px",
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
                </div>
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
