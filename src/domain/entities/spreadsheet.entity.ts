import { ISelectColorOptions } from "@/components/Modals/AddColumn";

export interface IColumnProjection {
    title: string;
    type?: string;
    order: number;
    width: number;
    picklistValues?: ISelectColorOptions[]
}

export interface ISpreadSheet {
    userId: string,
    columns: IColumnProjection[],
    data: []
}