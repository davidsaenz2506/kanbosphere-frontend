export interface IColumnProjection {
    title: string;
    type?: string;
    width: number;
    picklistValues?: []
}

export interface ISpreadSheet {
    userId: string,
    columns: IColumnProjection[],
    data?: []
}