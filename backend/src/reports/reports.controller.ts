import {Controller, Get, Res, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {InventoryService} from '../sales/inventory/inventory.service';
import * as ExcelJS from 'exceljs';
import {Row, Worksheet} from 'exceljs';
import {InventoryItem} from '../sales/inventory/inventory-item';

@Controller('reports')
export class ReportsController {

  constructor(public inventoryService: InventoryService) {
  }


  @Get('/stockValuation')
  async stockValuation(@Res() res) {
    const wb = new ExcelJS.Workbook();
    const worksheet: Worksheet =  wb.addWorksheet('Stock Valuation');
    worksheet.columns = [
      {header: 'Id', width: 10, key: 'id'},
      {header: 'Name', width: 40, key: 'name'},
      {header: 'Color', key: 'color'},
      {header: 'Size', key: 'size'},
      {header: 'Qty', key: 'qty'},
      {header: 'Price', key: 'price'},
      {header: 'Total', width: 20, key: 'total'}
    ];

    const inventory: Array<InventoryItem> = await this.inventoryService.repo.find();
    for( let idx=0; idx <  inventory.length ; idx++ ) {
      worksheet.addRow({'id': inventory[idx].id,
                             'name': inventory[idx].product.name,
                             'qty': inventory[idx].qty,
                             'color': inventory[idx].details[1].value,
                             'size': inventory[idx].details[0].value,
                             'price': inventory[idx].price,
                             'total': 'Total'});
    }


    let firstRow: Row = worksheet.getRow(2);
    let lastRow: Row = worksheet.lastRow;
    worksheet.eachRow( (row, rowNumber) => {
      if( rowNumber == 1 ) {
        row.height = 22;
        row.fill = {type: 'pattern', fgColor: {argb: '0075a9'}, pattern: 'solid' };
        row.font = {bold: true, color: {argb: 'ffffff'}, size: 15};
      }

      if( rowNumber > 1) {
        row.getCell('total').value = {date1904: false, formula: `${row.getCell('qty').address}*${row.getCell('price').address}`};
      }


    });
    worksheet.getRow(2);
    worksheet.addRow({'id':'', 'name':'', 'qty': '', 'price': '', 'total': ''});
    const totalRow = worksheet.addRow({'id':'', 'name':'', 'qty': '', 'price': 'TOTAL', 'total': {date1904: false, formula: `SUM(${firstRow.getCell('total').address}:${lastRow.getCell('total').address})`}});
    totalRow.getCell('price').font = {bold: true, color: {argb: '3fa53e'}, size: 15};
    totalRow.getCell('total').font = {bold: true, color: {argb: '3fa53e'}, size: 15}

    const buffer = await wb.xlsx.writeBuffer({ filename: 'stock-valuation'});
    res.header('Content-Disposition', 'attachment; filename="stock-valuation.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }
}
