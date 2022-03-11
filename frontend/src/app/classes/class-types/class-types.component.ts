import {Component, Inject, OnInit} from '@angular/core';
import {ClassesService} from '../classes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Category} from '@models/category';
import {CategoryService} from '@shared/category/category.service';

@Component({
  selector: 'class-types',
  templateUrl: './class-types.component.html',
  styleUrls: ['./class-types.component.scss']
})
export class ClassTypesComponent  implements OnInit {
  form: FormGroup;

  constructor( private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public classType: Category) { }

  ngOnInit(): void {
      this.form = this.fb.group({
        id: [this.classType.id],
        name: [this.classType.name, [Validators.required, Validators.pattern('\w+')]],
        subcategories: [this.classType.subcategories],
        type: ['service']
      });
  }

}
