import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClassModel} from '../../class.model';
import {Category} from '@models/category';
import {ClassTypesComponent} from '../../class-types/class-types.component';
import {CategoryService} from '@shared/category/category.service';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-create-class-dialog',
  templateUrl: './create-class-dialog.component.html',
  styleUrls: ['./create-class-dialog.component.scss']
})
export class CreateClassDialogComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private dialog: MatDialog, public categoryService: CategoryService,
              private dialogRef: MatDialogRef<CreateClassDialogComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: ClassModel) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      categoryId: [this.data.categoryId  , [Validators.required]],
      branchId: [this.data.branchId]
    });

    this.categoryService.categories
  }

  merge() {
    this.dialogRef.close(this.formGroup.value);
  }

   newClassType() {
    const category: Category = {id: 0, name: '', subcategories:[], type: 'service'};
      // this.dialog.open(this.formGroup)
    this.dialog.open(ClassTypesComponent, {data: category}).afterClosed().subscribe(async (categoryToSave) => {
      if ( categoryToSave ) {
       const savedCategory = await this.categoryService.mergeCategory(categoryToSave);

       this.formGroup.patchValue({categoryId: savedCategory.id});
      }
    });
  }
}
