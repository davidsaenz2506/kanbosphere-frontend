import { IDataToDo } from "./todo.entity";

export interface IWspUser {
    userId: string;
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData: IDataToDo[]
}