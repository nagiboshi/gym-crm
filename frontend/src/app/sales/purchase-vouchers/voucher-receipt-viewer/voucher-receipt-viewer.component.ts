import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PurchaseVoucher} from '@models/purchase-voucher';
import {CommunicationService} from '@shared/communication.service';
import {Tax} from '@models/tax';

@Component({
  selector: 'voucher-receipt-viewer',
  templateUrl: './voucher-receipt-viewer.component.html',
  styleUrls: ['./voucher-receipt-viewer.component.scss']
})
export class VoucherReceiptViewerComponent implements OnInit {
  total: number;
  taxes: Tax[];
  constructor(@Inject(MAT_DIALOG_DATA) public voucher: PurchaseVoucher, private com: CommunicationService) { }

  ngOnInit(): void {
    this.total =  this.voucher.items.map( p => p.price * p.qty ).reduce( (prevProdTotal, curProdTotal) => {
          if ( prevProdTotal ) {
            return prevProdTotal + curProdTotal
          } else {
            return curProdTotal;
          }
      });

    this.taxes = this.com.getTaxes()
  }

  print() {
      window.print();
  }
}
