import { ISelectColorOptions } from "@/components/Modals/AddColumn";

export interface IChildCompounds {
    name: string;
    columnValue: string;
}

export interface ICompoundProjection {
    formulaName: string;
    compounds: IChildCompounds[]
}

export interface IColumnProjection {
    title: string;
    type: string;
    order: number;
    width: number;
    icon: string;
    compoundValues?: ICompoundProjection;
    picklistValues?: ISelectColorOptions[]
}

export interface ISpreadSheet {
    userId: string,
    columns: IColumnProjection[],
    data: []
}