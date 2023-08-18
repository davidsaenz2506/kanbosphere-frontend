import { IDataToDo } from "@/domain/entities/todo.entity";

export function sortByDate(a: IDataToDo, b: IDataToDo) {
    if (a.createDate && b.createDate) {
      const dayMonthA = new Date(a.createDate).getDate() * 100 + new Date(a.createDate).getMonth();
      const dayMonthB = new Date(b.createDate).getDate() * 100 + new Date(b.createDate).getMonth();
      return dayMonthA - dayMonthB;
    }
  }