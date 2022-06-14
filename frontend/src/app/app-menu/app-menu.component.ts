import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '@shared/user.service';

interface AppRoute {
  label: string;
  path: string;
  active: boolean;
  expanded?: boolean;
  children: AppRoute[];
  matIcon?: string;
  customMatIcon?: string;

}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
  matIcon?: string;
  customMatIcon?: string;
}

interface MainMenuState {
  expandedMenuItems: FlatNode[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent implements OnInit {
  private _transformer = (node: AppRoute, level: number) => {
    const transformedNode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.label,
      level: level,
      path: node.path
    };
    if (node.matIcon) {
      transformedNode['matIcon'] = node.matIcon;
    }

    if (node.customMatIcon) {
      transformedNode['customMatIcon'] = node.customMatIcon;
    }

    return transformedNode;
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(private router: Router, private userService: UserService, private cd: ChangeDetectorRef) {
    this.dataSource.data = [
      {label: 'Members', children: [], matIcon: 'group', active: false, path: '/members'},
      {
        label: 'Schedules', active: false, matIcon: 'assignment_turned_in', path: '/classes',
        children: [
          {label: 'Classes', active: false, path: '/classes/list', children: []},
          {label: 'Class Types', active: false, path: '/classes/class-categories', children: []}]
      },
      {
        label: 'Sales', customMatIcon: 'sales-icon', active: false, path: '/sales',
        children: [
          {children: [], label: 'Inventory', active: false, path: '/sales/inventory'},
          {children: [], label: 'Purchase Voucher', active: false, path: '/sales/purchase-voucher'},
          {children: [], label: 'Memberships', active: false, path: '/sales/memberships'},
          {children: [], label: 'Suppliers', active: false, path: '/sales/suppliers'},
          {children: [], label: 'Product Categories', active: false, path: '/sales/categories'}]
      },
      {label: 'Automation', active: false, path: '/workflow', children: [
          {children: [], label: 'Workflows', active: false, path: '/workflow'},
          {children: [], label: 'Forms', active: false, path: '/workflow/forms'}
        ]},
      {label: 'Reports', matIcon: 'assessment', active: false, path: '/reports', children: []}
    ];
  }

  private saveState() {
    const routes = this.dataSource.data;
    const expandedMenuItems: FlatNode[] = [];
    this.treeControl.dataNodes.filter(n => this.treeControl.isExpandable(n)).forEach((n) => {
      if (this.treeControl.isExpanded(n)) {
        expandedMenuItems.push(n);
      }
    });
    const mainMenuState: MainMenuState = {expandedMenuItems: expandedMenuItems};
    localStorage.setItem('main-menu', JSON.stringify(mainMenuState));
  }

  private clearState() {
    localStorage.removeItem('main-menu');
  }

  private loadState() {
    const mainMenuStateStr = localStorage.getItem('main-menu');
    if (mainMenuStateStr) {
      const mainMenuState: MainMenuState = JSON.parse(mainMenuStateStr);
      for (const flatNode of this.treeControl.dataNodes.filter(d => d.expandable)) {
        for (const stateFlatNode of mainMenuState.expandedMenuItems) {
          if (flatNode.path == stateFlatNode.path) {
            this.treeControl.expand(flatNode);
          }
        }
      }
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {

    this.userService.token$.subscribe((u) => {
      if (!u) {
        this.clearState();
      }
    });

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url == '/') {

        }
        this.saveState();
      }
    });
    this.loadState();

  }

}
