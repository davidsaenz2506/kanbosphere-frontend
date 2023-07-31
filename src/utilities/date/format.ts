import { DateTime } from "luxon";

export const formatDate = (currentDateFromSQL: Date, format: string) => {
    const newUserDate = new Date(new Date(currentDateFromSQL)).toUTCString();
    const jsonDate = new Date(newUserDate).toJSON();

    return DateTime.fromSQL(jsonDate.split("T")[0]).toFormat(format);
};