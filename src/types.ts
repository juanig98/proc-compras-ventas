export type VoucherType = '000-No definida'
    | '001-Factura A'
    | '002-Nota de débito A'
    | '003-Nota de crébito A'
    | "006-Factura B"
    | "007-Nota de débito B"
    | "008-Nota de crébito B";

export type EntityType = 'T' | 'L';

export type SiNoType = 'Si' | 'No';

export class Report {
    sales: ISale[];
    buys: IBuy[];

    constructor() {
        this.sales = [];
        this.buys = [];
    }
}

export interface ISale {
    date: Date;
    voucherType: VoucherType;
    destination: string;
    number: string;
    subtotal: number;
    taxIVA: number;
    total: number;
    entity: EntityType;
}
export interface IBuy {
    date: Date;
    voucherType: VoucherType;
    issuer: string;
    number: string;
    subtotal: number;
    taxIVA: number;
    percepIVA: number;
    percepIIBB: number;
    total: number;
    entity: EntityType;
    received: SiNoType;
}

export interface FileToDescompress {
    pathZip: string;
    folderOutput: string;
}
