import {Component, Input, OnInit} from '@angular/core';


export interface FormElement {
  type: 'input' | 'textarea' | 'submit' | 'label',
  name: string,
  styles: {
    [style:string]: string
  }
}

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input()
  formElements: FormElement[];

  constructor() { }

  ngOnInit(): void {
  }

}
