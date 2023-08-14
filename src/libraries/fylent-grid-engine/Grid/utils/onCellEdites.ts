
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { EditableGridCell, Item } from "@glideapps/glide-data-grid";
import { DateTime } from "luxon";

export const editGridCell = async (
    cell: Item,
    columns: IColumnProjection[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    newValue: EditableGridCell
) => {
    const [col, row]: Item = cell;
    const key: string | undefined = columns[col]?.title;
    const type: string | undefined = columns[col]?.type;

    if (type === "string") data[row][key] = newValue.data;
    if (type === "boolean") data[row][key] = newValue.data;
    if (type === "number") data[row][key] = newValue.data;

    if (type === "date") {
        const currentDate =
            newValue.data &&
                typeof newValue.data === "object" &&
                "date" in newValue.data
                ? newValue.data.date
                : "";
        const ISODate: Date = new Date(
            typeof currentDate === "string" ? currentDate : ""
        );
        const newDate: Date = DateTime.fromISO(ISODate.toISOString()).toISO();

        data[row][key] = newDate;
    }

    if (type === "picklist")
        data[row][key] =
            newValue.data &&
                typeof newValue.data === "object" &&
                "value" in newValue.data
                ? newValue.data.value
                : "";

    if (type === "multipicklist")
        data[row][key] =
            newValue.data &&
                typeof newValue.data === "object" &&
                "tags" in newValue.data &&
                Array.isArray(newValue.data.tags)
                ? newValue.data.tags.join(";")
                : "";

    if (type === "phone") data[row][key] = newValue.data &&
        typeof newValue.data === "object" &&
        "phone" in newValue.data
        ? newValue.data.phone
        : "";

    if (type === "time") data[row][key] = newValue.data &&
        typeof newValue.data === "object" &&
        "time" in newValue.data
        ? newValue.data.time
        : "";

    if (type === "mail") {
        const errors: string[] = [];
        if (typeof newValue.data === "string") {
            // eslint-disable-next-line no-useless-escape
            const res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            const valor = res.test(newValue.data);

            if (!valor) errors.push("err::invalidEmail");
        }

        if (errors.length) {
            return false;
        } else data[row][key] = newValue.data;
    }

    return true;
};
