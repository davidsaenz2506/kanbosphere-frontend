
export interface IDataToDo {
    userId: string,
    taskId: string,
    status: string,
    info: string,
    title: string,
    createDate: Date,
    finishDate?: Date
}