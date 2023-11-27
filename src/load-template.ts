import Excel from 'exceljs';
import { join } from 'path';
import { paths } from './helpers';
import { readData } from './process-data';
import * as fs from 'fs';
import moment from 'moment';

enum ComprasCells {
    FECHA = 'A',
    TIPO_COMPROBANTE = 'B',
    EMISOR = 'C',
    NUMERO = 'D',
    SUBTOTAL = 'E',
    IVA = 'F',
    PERCEP_IIBB = 'G',
    PERCEP_IVA = 'H',
    TOTAL = 'I',
    ENTE = 'J',
    RECIBIDA = 'K',
}
enum VentasCells {
    FECHA = 'A',
    TIPO_COMPROBANTE = 'B',
    DESTINATARIO = 'C',
    NUMERO = 'D',
    SUBTOTAL = 'E',
    IVA = 'F',
    TOTAL = 'G',
    ENTE = 'H',
}

export const loadTemplate = async () => {
    var workbook = new Excel.Workbook();

    // fs.copyFileSync(join(paths.templates, 'informe.xltx'), join(paths.outputs, 'informe.xltx'));
    const informexltx = await workbook.xlsx.readFile(join(paths.templates, 'informe.xltx'));


    const rData = await readData();

    const wsCompras = informexltx.getWorksheet("Compras");
    const wsVentas = informexltx.getWorksheet("Ventas");

    if (!wsCompras) throw new Error("No existe wsCompras")
    if (!wsVentas) throw new Error("No existe wsVentas")

    let row = 30;

    rData.buys.forEach(async (buy) => {
        wsCompras.getCell(ComprasCells.FECHA + row).value = moment(buy.date).format("DD/MM/YYYY");
        wsCompras.getCell(ComprasCells.TIPO_COMPROBANTE + row).value = buy.voucherType;
        wsCompras.getCell(ComprasCells.EMISOR + row).value = buy.issuer;
        wsCompras.getCell(ComprasCells.NUMERO + row).value = buy.number;
        wsCompras.getCell(ComprasCells.SUBTOTAL + row).value = buy.subtotal;
        wsCompras.getCell(ComprasCells.IVA + row).value = buy.taxIVA;
        wsCompras.getCell(ComprasCells.PERCEP_IIBB + row).value = buy.percepIIBB;
        wsCompras.getCell(ComprasCells.PERCEP_IVA + row).value = buy.percepIVA;
        wsCompras.getCell(ComprasCells.TOTAL + row).value = buy.total;
        wsCompras.getCell(ComprasCells.ENTE + row).value = buy.entity;
        wsCompras.getCell(ComprasCells.RECIBIDA + row).value = buy.received;
        row++;
    })

    row = 3
    rData.sales.forEach(async (sale) => {
        wsVentas.getCell(VentasCells.FECHA + row).value = moment(sale.date).format("DD/MM/YYYY");
        wsVentas.getCell(VentasCells.TIPO_COMPROBANTE + row).value = sale.voucherType;
        wsVentas.getCell(VentasCells.DESTINATARIO + row).value = sale.destination;
        wsVentas.getCell(VentasCells.NUMERO + row).value = sale.number;
        wsVentas.getCell(VentasCells.SUBTOTAL + row).value = sale.subtotal;
        wsVentas.getCell(VentasCells.IVA + row).value = sale.taxIVA;
        wsVentas.getCell(VentasCells.TOTAL + row).value = sale.total;
        wsVentas.getCell(VentasCells.ENTE + row).value = sale.entity;
        row++;
    })

    await workbook.xlsx.writeFile(join(paths.outputs, 'informe.xlsx'))
}

