import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClassModel} from '../class.model';
import {CommunicationService} from '@shared/communication.service';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import { CreateClassDialogComponent} from './create-class-dialog/create-class-dialog.component';
import {Branch} from '@models/branch';
import {ClassesService} from '../classes.service';
import {CategoryService} from '@shared/category/category.service';


@Component({
  selector: 'class-settings',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit, OnDestroy, AfterViewInit {
  classesColumns = ['name', 'classCategory', 'edit', 'delete'];
  dataSource: MatTableDataSource<ClassModel>;
  branches: Branch[] = [{id: -1, name: 'All'}];
  classesSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(public categoryService: CategoryService, private classesService: ClassesService, private communicationService: CommunicationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ClassModel>([]);

    this.dataSource.filterPredicate = (data, filter: any) => !filter || filter == -1 || data.categoryId == filter;
    this.classesSub = this.classesService.classes$.subscribe(classes => this.dataSource.data = classes);
  }

  filterOutClassesByType(categoryId: number) {
    this.dataSource.filter = <any> categoryId;
  }

  _newClass(): ClassModel {
    return {id: 0, categoryId: 0, name: '', branchId: null};
  }

  addNewClass() {
    this.showMergeClassDialog(this._newClass());
  }

  async showMergeClassDialog(classModel?: ClassModel) {
    this.dialog.open(CreateClassDialogComponent, {data: classModel}).afterClosed().subscribe((classToCreate) => {
      if (classToCreate) {
        this.classesService
          .addClass(classToCreate);
      }
    });
  }

  remove(classToRemove: ClassModel) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete class ${classToRemove.name}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.classesService.removeClass(classToRemove.id);
      }
    });

  }

  editClass(classToEdit: ClassModel) {
    this.showMergeClassDialog(classToEdit);
  }

  ngOnDestroy(): void {
    this.classesSub.unsubscribe();
  }

}
