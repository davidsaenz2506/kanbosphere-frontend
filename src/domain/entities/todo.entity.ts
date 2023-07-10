export interface IPriority {
    value: string;
    color: string | undefined;
}
export interface IDataToDo {
    userId: string,
    taskId: string,
    status: string,
    priority: IPriority,
    info: string,
    description: string,
    title: string,
    createDate: Date,
    file: string,
    finishDate?: Date
}