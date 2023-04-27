import { ISelectColorOptions } from "@/components/organisms/modals/Spread/AddColumn";

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