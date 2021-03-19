import {Component, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {FITNESS_CLASS_TYPE, MARTIAL_ARTS_CLASS_TYPE} from '../../models/class-type';
import {CommunicationService} from '../../shared/communication.service';
import {ClassModel} from '../../classes/class.model';
import {groupBy} from 'lodash';
/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ClassNode {
  name: string;
  children?: ClassNode[];
}


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-class-settings-page',
  templateUrl: './class-settings-page.component.html',
  styleUrls: ['./class-settings-page.component.scss']
})
export class ClassSettingsPageComponent implements OnInit {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  private _transformer = (node: ClassNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level
    };
  }

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private communicationService: CommunicationService) {
    // this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    const classes: ClassModel[] = this.communicationService.getClasses();
    const groupedClasses = groupBy(classes, 'classType');
    const data = [];
    for( const classType in groupedClasses ) {
      data.push({name: classType, children: groupedClasses[classType]});
    }

    this.dataSource.data = data;
    console.log('grouped classes ', groupedClasses);
  }

}
