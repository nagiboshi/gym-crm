import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Supplier} from '@models/supplier';

@Component({
  selector: 'supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.scss']
})
export class SupplierViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public supplier: Supplier ) { }

  ngOnInit(): void {
  }

}
