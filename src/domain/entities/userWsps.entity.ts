import { IDataToDo } from "./todo.entity";

export interface IWspUser {
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData: IDataToDo[]
}