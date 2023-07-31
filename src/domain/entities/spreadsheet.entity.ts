import { ISelectColorOptions } from "@/components/Modals/AddColumn";

export interface IColumnProjection {
    title: string;
    type?: string;
    width: number;
    picklistValues?: ISelectColorOptions[]
}

export interface ISpreadSheet {
    userId: string,
    columns: IColumnProjection[],
    data: []
}