import { ICurrentWspContext } from "@/context/currentWorkSpace/currentWsp.context";
import { IColumnProjection } from "@/domain/entities/spreadsheet.entity";
import { UpdateWorkSpace } from "@/services/workspaces/update";
import { EditableGridCell, Item } from "@glideapps/glide-data-grid";
import { DateTime } from "luxon";

export const editGridCell = async (
    cell: Item,
    columns: IColumnProjection[],
    data: any,
    newValue: EditableGridCell,
    currentUserWsp: ICurrentWspContext
) => {
    const [col, row]: Item = cell;
    const key: string | undefined = columns[col]?.title;
    const type: string | undefined = columns[col]?.type;

    if (type === "string") data[row][key] = newValue.data;
    if (type === "boolean") data[row][key] = newValue.data;
    if (type === "number") data[row][key] = newValue.data;

    if (type === "date") {
        // @ts-ignore
        let ISODate: Date = new Date(newValue.data.date);
        let newDate: Date = DateTime.fromISO(ISODate.toISOString()).toISO();

        data[row][key] = newDate;
    }
    // @ts-ignore
    if (type === "picklist") data[row][key] = newValue?.data?.value;

    // @ts-ignore
    if (type === "multipicklist") data[row][key] = newValue.data.tags.join(";");

    // @ts-ignore
    if (type === "phone") data[row][key] = newValue.data.phone;

    // @ts-ignore
    if (type === "time") data[row][key] = newValue.data.date

    if (type === "mail") {
        const errors: string[] = [];
        if (typeof newValue.data === "string") {
            let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            const valor = res.test(newValue.data);

            if (!valor) errors.push("err::invalidEmail");
        }

        if (errors.length) {
            return false;
        } else data[row][key] = newValue.data;
    }

    return true;

};
