import * as React from "react";
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

interface DatePickerCellProps {
  readonly kind: "date";
  readonly date: Date | undefined;
  readonly displayDate: string;
  readonly format: "date" | "datetime-local";
}

export type DatePickerCell = CustomCell<DatePickerCellProps>;

const renderer: CustomRenderer<DatePickerCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is DatePickerCell => {
    return (cell.data as any).type === "date";
  },

  draw: (args, cell) => {
    const { displayDate } = cell.data;
    drawTextCell(args, displayDate, cell.contentAlign);
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
