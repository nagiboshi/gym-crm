import { Component, OnInit } from '@angular/core';
import {FormElement} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  formElements: FormElement[];
  constructor() { }

  ngOnInit(): void {
  }

}
