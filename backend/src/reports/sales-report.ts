import {Between, FindManyOptions, IsNull, Not} from 'typeorm';
import * as ExcelJS from 'exceljs';
import {Buffer, Column, Worksheet} from 'exceljs';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Payment, PaymentFields} from '../payments/payment';
import {PaymentService} from '../payments/payment.service';
import {MembershipPurchaseFields} from '../membership-purchase/membership-purchase';
import {HelpersService} from '../shared/helpers.service';
import {TaxService} from '../tax/tax.service';
import {Tax} from '../tax/tax';
import {filter, groupBy} from 'lodash';
import {StockPurchaseFields} from '../sales/stock-purchase/stock-purchase';
import {InventoryItemFields} from '../sales/inventory/inventory-item';
import {PropertyValueFields} from '../sales/properties/property-value/property-value';

export class SalesReport {
  private wb = new ExcelJS.Workbook();
  private worksheet: Worksheet = this.wb.addWorksheet('Sales Report');

  defaultColumns: Array<Partial<Column>> = [
    {header: 'Sale Date', width: 10, key: 'saleDate'},
    {header: 'Client ID', width: 20, key: 'clientId'},
    {header: 'Client', width: 10, key: 'client'},
    {header: 'Mobile', width: 20, key: 'mobile'},
    {header: 'Sale ID', width: 10, key: 'saleId'},
    // TODO:: Think about to change class to any other option
    {header: 'Item Name', width: 25, key: 'itemName'},
    {header: 'Notes', width: 20, key: 'notes'},
    {header: 'Expiry Date', width: 20, key: 'expiry'},
    {header: 'Location', key: 'location', width: 20},
    {header: 'Color', key: 'color'},
    {header: 'Size', key: 'size'},
    {header: 'Quantity', key: 'qty'},
    {header: 'Subtotal', key: 'subtotal'},
    {header: 'Discount %', width: 20, key: 'discount'},
    {header: 'Discount amount', width: 15, key: 'discountAmount'},
    {header: 'TAX', key: 'tax'},
    {header: 'Item Total', width: 15, key: 'itemTotal'},
    {header: 'Total paid', width: 15, key: 'totalPaid'},
  ];

  constructor(private paymentService: PaymentService,
              private helpersService: HelpersService,
              private taxService: TaxService,
              private filter: any) {
  }

  private async getData(): Promise<Payment[]> {

    const queryFilter: FindManyOptions = {
      relations: [],
      where: {}
    };
    if (this.filter.fromDate && this.filter.toDate) {
      queryFilter.where[PaymentFields.date] = Between(this.filter.fromDate, this.filter.toDate);
    }


    queryFilter['relations'] = [PaymentFields.paymentMethod];

    const RELATION_MEMBERSHIP_BUYER = `${PaymentFields.membershipPurchase}.${MembershipPurchaseFields.buyer}`;
    const RELATION_STOCK_BUYER = `${PaymentFields.stockPurchase}.${StockPurchaseFields.buyer}`;
    const RELATION_INVENTORY_ITEM = `${PaymentFields.stockPurchase}.${StockPurchaseFields.item}`;
    const RELATION_INVENTORY_ITEM_PRODUCT = `${PaymentFields.stockPurchase}.${StockPurchaseFields.item}.${InventoryItemFields.product}`;
    const RELATION_INVENTORY_ITEM_DETAILS = `${PaymentFields.stockPurchase}.${StockPurchaseFields.item}.${InventoryItemFields.details}`;
    const RELATION_INVENTORY_ITEM_DETAILS_PROPERTY = `${PaymentFields.stockPurchase}.${StockPurchaseFields.item}.${InventoryItemFields.details}.${PropertyValueFields.property}`;
    const RELATION_MEMBERSHIP = `${PaymentFields.membershipPurchase}.${MembershipPurchaseFields.membership}`;
    const RELATION_MEMBERSHIP_SALE_LOCATION = `${PaymentFields.membershipPurchase}.${MembershipPurchaseFields.saleLocation}`;
    const RELATION_STOCK_SALE_LOCATION = `${PaymentFields.stockPurchase}.${StockPurchaseFields.saleLocation}`;
    if (this.filter.type == 'service') {
      queryFilter['relations'] = [...queryFilter['relations'], PaymentFields.membershipPurchase, RELATION_MEMBERSHIP_BUYER, RELATION_MEMBERSHIP, RELATION_MEMBERSHIP_SALE_LOCATION];
      queryFilter.where[PaymentFields.membershipPurchaseId] = Not(IsNull());
    } else if (this.filter.type == 'stock') {
      queryFilter['relations'] = [...queryFilter['relations'], PaymentFields.stockPurchase, RELATION_STOCK_BUYER, RELATION_INVENTORY_ITEM, RELATION_INVENTORY_ITEM_DETAILS, RELATION_INVENTORY_ITEM_DETAILS_PROPERTY, RELATION_INVENTORY_ITEM_PRODUCT, RELATION_STOCK_SALE_LOCATION];
      queryFilter.where[PaymentFields.stockPurchaseId] = Not(IsNull());
    } else {
      queryFilter['relations'] = [...queryFilter['relations'], PaymentFields.stockPurchase, PaymentFields.membershipPurchase, RELATION_STOCK_BUYER, RELATION_MEMBERSHIP_BUYER, RELATION_INVENTORY_ITEM, RELATION_INVENTORY_ITEM_DETAILS, RELATION_INVENTORY_ITEM_DETAILS_PROPERTY, RELATION_MEMBERSHIP, RELATION_INVENTORY_ITEM_PRODUCT, RELATION_STOCK_SALE_LOCATION, RELATION_MEMBERSHIP_SALE_LOCATION];
    }
    return this.paymentService.find(queryFilter);
  }

  private createTaxColumnHeaderKey(tax: Tax): Partial<Column> {
    return {header: tax.name, key: tax.name.replace(' ', '_').toLowerCase()};
  }

  async build() {
    const columns = [...this.defaultColumns];
    const payments: Payment[] = await this.getData();
    if (payments.length == 0) {

    }
    const taxes = await this.taxService.find();
    const taxIdx = columns.findIndex((c) => c.key == 'tax');
    if (taxIdx != -1) {
      const taxColumns: Array<Partial<Column>> = taxes.map((t) => {
        return this.createTaxColumnHeaderKey(t);
      });

      // this.defaultColumns
      columns.splice(taxIdx, 1, ...taxColumns);
    }

    this.worksheet.columns = columns;


    this.worksheet.eachRow((row, rowNumber) => {
      if (rowNumber == 1) {
        row.height = 22;
        row.fill = {type: 'pattern', fgColor: {argb: '0075a9'}, pattern: 'solid'};
        row.font = {bold: true, color: {argb: 'ffffff'}, size: 15};
      }
    });

    const groupProperties = [];

    if (this.filter.type == 'service') {
      groupProperties.push('membershipPurchaseId');
    } else if (this.filter.type == 'stock') {
      groupProperties.push('stockPurchaseId');
    } else {
      groupProperties.push('membershipPurchaseId');
      groupProperties.push('stockPurchaseId');
    }

    for (let groupProperty of groupProperties) {
      // In case if selected filter.type = 'All' we go through membership payments and
      // filter out stock payments, and grouping them by purchaseId
      let groupedPayments: { [id: string]: Payment[] } = groupBy(filter(payments, p => p[groupProperty] != null), groupProperty);
      for (let purchaseId in groupedPayments) {

        for (let payment of groupedPayments[purchaseId]) {
          const saleDate = moment(payment.date);
          let client;
          let clientId;
          let itemName;
          let notes;
          let expiry: Moment;
          let color;
          let size;
          let quantity;
          let subtotal;
          let discount;
          let discountAmount;
          let location;
          let itemTotal;
          let totalPaid = payment.amount;
          let mobile;
          let purchase;
          if (payment.stockPurchase != null) {
            purchase = payment.stockPurchase;
          }

          if (payment.membershipPurchase != null) {
            purchase = payment.membershipPurchase;
          }

          clientId = purchase.buyerId;
          client = purchase.buyer ? `${purchase.buyer.firstName} ${purchase.buyer.lastName}` : '--';
          notes = purchase.note;
          mobile = purchase.buyer.phoneNumber;
          discount = purchase.discount;

          let saleId;
          if (payment.stockPurchase) {
            itemName = purchase.item.product.name;
            quantity = purchase.qty;
            const price = purchase.price * quantity;
            discountAmount = price * (discount / 100);
            subtotal = purchase.stockPurchase.price;
            location = purchase.saleLocation.name;
            saleId = payment.stockPurchaseId;
            let priceWithDiscount = price - discountAmount;
            itemTotal = priceWithDiscount;
            const allTaxes = taxes.map(tax => priceWithDiscount * tax.value / 100);
            for (const tax of allTaxes) {
              itemTotal += tax;
            }


            if (purchase.item.details) {
              for (const detail of purchase.item.details) {
                if (detail.property.name.toLowerCase() == 'color') {
                  color = detail.value;
                }
                if (detail.property.name.toLowerCase() == 'size') {
                  size = detail.value;
                }
              }
            }
          }

          if (payment.membershipPurchase) {
            const price = purchase.price;
            discountAmount = price * (discount / 100);
            location = purchase.saleLocation.name;
            let priceWithDiscount = price - discountAmount;
            itemTotal = priceWithDiscount;
            saleId = payment.membershipPurchaseId;
            subtotal = payment.membershipPurchase.price;
            const allTaxes = taxes.map(tax => priceWithDiscount * tax.value / 100);
            for (const tax of allTaxes) {
              itemTotal += tax;
            }

            color = '--';
            size = '--';
            quantity = 1;
            itemName = payment.membershipPurchase.membership.name;
            expiry = this.helpersService.getMembershipExpirationMoment(payment.membershipPurchase);
          }

          const data = {};
          this.injectTaxes(data, purchase.price - discountAmount, taxes);
          data['saleDate'] = saleDate.format('L');
          data['clientId'] = clientId;
          data['client'] = client;
          data['saleId'] = saleId;
          data['itemName'] = itemName;
          data['notes'] = notes;
          data['expiry'] = expiry?.format('L') ?? '--';
          data['location'] = location;
          data['mobile'] = mobile;
          data['color'] = color;
          data['size'] = size;
          data['qty'] = quantity;
          data['subtotal'] = subtotal;
          data['discount'] = discount;
          data['discountAmount'] = discountAmount;
          data['itemTotal'] = itemTotal.toFixed(2);
          data['totalPaid'] = totalPaid;
          this.worksheet.addRow(data);
        }
      }
    }
  }

  private injectTaxes(data: any, total: number, taxes: Tax[]): void {
    taxes.forEach((tax) => {
      data[this.createTaxColumnHeaderKey(tax).key] = (total * (tax.value / 100)).toFixed(2);
    });
  }

  async write(): Promise<Buffer> {
    await this.build();
    return this.wb.xlsx.writeBuffer({filename: 'sales-report'});
  }
}
