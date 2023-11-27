import * as fs from "fs";
import { join } from "path";
import { paths } from "./helpers";
import { EntityType, IBuy, ISale, Report, VoucherType } from "./types";

export const readData = async (): Promise<Report> => {
    try {

        const report: Report = new Report();

        const buys1 = fs.readFileSync(join(paths.inputs, 'recibidos.csv'), 'utf-8')

        report.buys = extractBuys(buys1)
        const sales1 = fs.readFileSync(join(paths.inputs, 'ventas-local.txt'), 'utf-8')
        report.sales = extractSales(sales1, "L")

        const sales2 = fs.readFileSync(join(paths.inputs, 'ventas-taller.txt'), 'utf-8')
        report.sales.push(...extractSales(sales2, "T"));

        const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(memoryUsed * 100) / 100} MB`);

        fs.writeFileSync(join(paths.outputs, 'readData.json'), JSON.stringify(report));

        return report;
    } catch (err) {
        console.error(err);
        throw new Error("Ocurrió un error");

    }
}

function extractBuys(data: string): IBuy[] {
    const buys: IBuy[] = [];

    data.split(/\r?\n/)
        .forEach((line, index) => {
            const columns = line.split(";");
            if (index == 0) return;
            if (line.length < 10) return;

            const subtotal = Number(`${columns[11].replace(",", ".")}`);
            const taxIVA = Number(`${columns[15].replace(",", ".")}`);
            const total = Number(`${columns[16].replace(",", ".")}`);

            buys.push({
                date: new Date(columns[0]),
                voucherType: defVoucherType(columns[1]),
                issuer: `${columns[8]} (${columns[7]})`,
                number: `${columns[2].toString().padStart(5, "0")}-${(columns[3].toString().padStart(8, "0"))}`,
                subtotal: Number(subtotal.toFixed(2)),
                taxIVA: Number(taxIVA.toFixed(2)),
                percepIVA: 0,
                percepIIBB: 0,
                total: Number(total.toFixed(2)),
                entity: "L",
                received: "No",
            })
        });

    return buys;
}

function extractSales(data: string, entity: EntityType): ISale[] {
    const sales: ISale[] = [];

    data.split(/\r?\n/)
        .forEach((line, index) => {
            if (index == 0) return;
            if (line.length < 10) return;

            const total = Number(`${line.substring(108, 121)}.${line.substring(121, 123)}`);
            const subtotal = Number(Number(`${line.substring(108, 121)}.${line.substring(121, 123)}`) / 1.21);
            const iva = total - subtotal;

            sales.push({
                date: new Date(`${line.substring(0, 4)}-${line.substring(4, 6)}-${line.substring(6, 8)}`),
                voucherType: defVoucherType(line.substring(10, 11)),
                destination: `${line.substring(78, 108).trim()} (${line.substring(67, 78)})`,
                number: `${line.substring(11, 16).padStart(5, "0")}-${(line.substring(28, 36).toString().padStart(8, "0"))}`,
                subtotal: Number(subtotal.toFixed(2)),
                taxIVA: Number(iva.toFixed(2)),
                total: Number(total.toFixed(2)),
                entity,
            })
        });

    return sales;
}
function defVoucherType(d: string | number): VoucherType {
    if (d.toString() == '1' || d.toString() == '001') return "001-Factura A";
    if (d.toString() == '2' || d.toString() == '002') return "002-Nota de débito A";
    if (d.toString() == '3' || d.toString() == '003') return "003-Nota de crébito A";
    if (d.toString() == '6' || d.toString() == '006') return "006-Factura B";
    if (d.toString() == '7' || d.toString() == '007') return "007-Nota de débito B";
    if (d.toString() == '8' || d.toString() == '008') return "008-Nota de crébito B";
    return "000-No definida"
} 