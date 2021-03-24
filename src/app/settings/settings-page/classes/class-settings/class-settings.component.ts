import {Component, OnInit} from '@angular/core';
import {ClassModel} from '../../../../classes/class.model';
import {CommunicationService} from '../../../../shared/communication.service';
import {first} from 'lodash';
import {ClassesDataSource} from './classes-data-source';
import {MatDialog} from '@angular/material/dialog';
import {ClassDialogData, CreateClassDialogComponent} from '../create-class-dialog/create-class-dialog.component';
import {ClassCategory} from '../../../../classes/class.category';
import {DeletePromptDialogComponent} from '../../../../shared/delete-class-dialog/delete-prompt-dialog.component';

@Component({
  selector: 'class-settings',
  templateUrl: './class-settings.component.html',
  styleUrls: ['./class-settings.component.scss']
})
export class ClassSettingsComponent implements OnInit {
  classesColumns = ['name', 'classCategory', 'edit', 'delete'];
  dataSource: ClassesDataSource;
  classCategories: ClassCategory[] = [{id: -1, name: 'All'}];

  constructor(private communicationService: CommunicationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.classCategories = [...this.classCategories, ...this.communicationService.getClassCategories()];
    this.dataSource = new ClassesDataSource(this.communicationService);
  }

  filterOutClassesByType(categoryId: number) {
    this.dataSource.filterByClassType(categoryId);
  }

  _newClass(): ClassModel {
    return {id: 0, categoryId: first(this.communicationService.getClassCategories()).id, name: ''};
  }

  addNewClass() {
    this.showMergeClassDialog();
  }

  showMergeClassDialog(classModel?: ClassModel) {
    const data: ClassDialogData = {
      classCategories: this.communicationService.getClassCategories(),
      classData: classModel ? classModel : this._newClass()
    };
    this.dialog.open(CreateClassDialogComponent, {data}).afterClosed().subscribe((classToCreate) => {
      if (classToCreate) {
        this.communicationService
          .addClass(classToCreate)
          .then(this.dataSource.updateClasses.bind(this.dataSource));
      }
    });
  }

  remove(classToRemove: ClassModel) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete class ${classToRemove.name}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.communicationService.removeClass(classToRemove.id)
          .then(this.dataSource.updateClasses.bind(this.dataSource));
      }
    });

  }

  editClass(classToEdit: ClassModel) {
    this.showMergeClassDialog(classToEdit);
  }
}
