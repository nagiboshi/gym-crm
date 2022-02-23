import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'lodash';
@Component({
  selector: 'stock-valuation-report',
  templateUrl: './stock-valuation-report.component.html',
  styleUrls: ['./stock-valuation-report.component.scss']
})
export class StockValuationReportComponent implements OnInit {
  stockValuationFormats = [{type: "html", name: "HTML"}, {type: "xls", name:"Excel"}]
  formatSelectionFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formatSelectionFormGroup = this.fb.group({
      format: [first(this.stockValuationFormats), Validators.required]
    });
  }

  submit() {

  }
}
