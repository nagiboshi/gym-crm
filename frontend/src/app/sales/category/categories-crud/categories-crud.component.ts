import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, emptyCategory, emptySubcategory, Subcategory} from '@models/category';
import {SubcategoryCrudComponent} from './subcategory-crud.component/subcategory-crud.component';
import {MatTableDataSource} from '@angular/material/table';
import {remove} from 'lodash';

@Component({
  selector: 'product-categories-crud',
  templateUrl: './categories-crud.component.html',
  styleUrls: ['./categories-crud.component.scss']
})
export class CategoriesCrudComponent implements OnInit {
  formGroup: FormGroup;
  dataSource: MatTableDataSource<Subcategory>;
  columns = ['name', 'edit', 'delete'];

  constructor(@Inject(MAT_DIALOG_DATA) private category: Category,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private matDialogRef: MatDialogRef<CategoriesCrudComponent>) {

  }

  ngOnInit(): void {
    if (!this.category) {
      this.category = emptyCategory();
    }

    this.dataSource = new MatTableDataSource<Subcategory>(this.category.subcategories);
    this.formGroup = this.fb.group({
      id: [this.category.id],
      name: [this.category.name, [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      subcategories: [this.category.subcategories]
    });

  }

  addSubcategory() {
    this.openSubcategoryCrudDialog(emptySubcategory(this.formGroup.value));
  }

  private openSubcategoryCrudDialog(subcategory?: Subcategory) {
    this.dialog.open(SubcategoryCrudComponent, {width: '40vw', data: subcategory}).afterClosed().subscribe((subcategory) => {
      if (subcategory) {
          const subcategories: Subcategory[] = this.formGroup.value.subcategories;

          if (subcategory.id != 0) {
            const idx = subcategories.findIndex(s => s.id == subcategory.id);
            if (idx != -1) {
              subcategories.splice(idx, 1, subcategory);
            } else {
              subcategories.push(subcategory);
            }
          } else {
            subcategories.push(subcategory);
          }
          this.formGroup.patchValue({subcategories: subcategories});
          this.dataSource.data = [...subcategories];
        }
      }
    );
  }

  save() {
    this.matDialogRef.close(this.formGroup.value);
  }

  removeSubcategory(subcategory) {
    const subcategories: Subcategory[] = this.formGroup.value.subcategories;
    remove(subcategories, s => s.id == subcategory.id && s.name == subcategory.name);
    this.dataSource.data = [...subcategories];
    this.formGroup.patchValue({subcategories: subcategories});
  }

  editSubcategory(subcategory: Subcategory) {
    this.openSubcategoryCrudDialog(subcategory);
  }
}
