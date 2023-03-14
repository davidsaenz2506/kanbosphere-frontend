import { IDataToDo } from "./todo.entity";

export interface IWspUser {
    _id?: string;
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData: IDataToDo[]
}