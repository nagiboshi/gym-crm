import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClassModel} from '../../../../classes/class.model';
import {CommunicationService} from '@shared/communication.service';
import {first} from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {ClassCategory} from '../../../../classes/class.category';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {ClassDialogData, CreateClassDialogComponent} from './create-class-dialog/create-class-dialog.component';
import {Branch} from '@models/branch';
import {ClassesService} from '../../../../classes/classes.service';


@Component({
  selector: 'class-settings',
  templateUrl: './class-settings.component.html',
  styleUrls: ['./class-settings.component.scss']
})
export class ClassSettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  classesColumns = ['name', 'classCategory', 'edit', 'delete'];
  dataSource: MatTableDataSource<ClassModel>;
  classCategories: ClassCategory[] = [{id: -1, name: 'All'}];
  branches: Branch[] = [{id: -1, name: 'All'}];
  classesSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private classesService: ClassesService, private communicationService: CommunicationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.classCategories = [...this.classCategories, ...this.classesService.getClassCategories()];
    this.dataSource = new MatTableDataSource<ClassModel>(this.classesService.getClasses());
    this.dataSource.filterPredicate = (data, filter: any) => !filter || filter == -1 || data.categoryId == filter;
    this.classesSub = this.classesService.classes$.subscribe(classes => this.dataSource.data = classes);
  }

  filterOutClassesByType(categoryId: number) {
    this.dataSource.filter = <any> categoryId;
  }

  _newClass(): ClassModel {
    return {id: 0, categoryId: first(this.classesService.getClassCategories()).id, name: '', branchId: null};
  }

  addNewClass() {
    this.showMergeClassDialog();
  }

  showMergeClassDialog(classModel?: ClassModel) {
    const data: ClassDialogData = {
      classCategories: this.classesService.getClassCategories(),
      classData: classModel ? classModel : this._newClass()
    };
    this.dialog.open(CreateClassDialogComponent, {data}).afterClosed().subscribe((classToCreate) => {
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
