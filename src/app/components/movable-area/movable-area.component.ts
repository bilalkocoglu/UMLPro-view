import { Component, OnInit } from '@angular/core';
import {Table} from '../../table';
import {TableManagementService} from '../../services/table-management.service';
import {Property} from '../../Property';
import {Function} from '../../Function';
import {DependencyManagementService} from '../../services/dependency-management.service';

@Component({
  selector: 'abe-movable-area',
  templateUrl: './movable-area.component.html',
  styleUrls: ['./movable-area.component.scss']
})
export class MovableAreaComponent {
  tables: Table[] = [];

  dependencyStatus = false;
  dependencySelectedItems: Table[] = [];

  constructor(private tableManagement: TableManagementService,
              private dependencyManagement: DependencyManagementService) {
    this.tableManagement.tableChange.subscribe((tables) => {
      this.tables = tables;
    });

    this.dependencyManagement.depencencyIsActive.subscribe((val) => this.dependencyStatusChange(val));
  }

  sendTables() {
    this.tableManagement.setTables(this.tables);
  }

  deleteTable(table: Table) {
    if (this.tables.indexOf(table) !== -1) {
      this.tables.splice(this.tables.indexOf(table), 1);
    }
    this.dependencyManagement.deleteTable(table);
   // console.log('Table Delete Son Hali => ', this.tables);
    this.sendTables();
  }

  addProperty(table: Table) {
    const propIdCount = this.tables.find(item => item.id === table.id).propertyIdCount;

    const property = new Property();
    property.id = propIdCount + 1;
    property.access = '+';
    this.tables.find(item => item.id === table.id).properties.push(property);

    this.tables.find(item => item.id === table.id).propertyIdCount = propIdCount + 1;

    this.sendTables();
  }

  addFunction(table: Table) {
    const funIdCount = this.tables.find(item => item.id === table.id).functionIdCount;

    const fun = new Function();
    fun.id = funIdCount + 1;
    fun.access = '+';

    this.tables.find(item => item.id === table.id).functions.push(fun);

    this.tables.find(item => item.id === table.id).functionIdCount = funIdCount + 1;

    this.sendTables();
  }

  deleteProperty(table: Table, property: Property) {
    const indexOf = this.tables.find(item => item.id === table.id).properties.indexOf(property);

    if (indexOf !== -1) {
      this.tables.find(item => item.id === table.id).properties.splice(indexOf, 1);
    }

    this.sendTables();
  }

  deleteFunction(table: Table, fun: Function) {
    const indexOf = this.tables.find(item => item.id === table.id).functions.indexOf(fun);

    if (indexOf !== -1) {
      this.tables.find(item => item.id === table.id).functions.splice(indexOf, 1);
    }

    this.sendTables();
  }

  addDependency(table: Table) {
    if (this.dependencyStatus === true) {
      if (this.dependencySelectedItems.length === 0) {
        this.dependencySelectedItems.push(table);
        return;
      }
      if (this.dependencySelectedItems.length === 1) {
        if (this.dependencySelectedItems[0] === table) {
          this.dependencySelectedItems = [];
        } else {
          this.dependencySelectedItems.push(table);
          this.dependencyManagement.addNewDependency(this.dependencySelectedItems);
          this.dependencySelectedItems = [];
          this.dependencyStatus = false;
        }
      }
    } else {
      return;
    }
  }

  getCustomStyle(table: Table) {
    if (table.type === 'Class') {       // obje tipi class ise düz çizgi
      if (this.dependencyStatus === true) {
        let findItem = false;
        this.dependencySelectedItems.forEach((item) => {
          if (item.id === table.id) {
            findItem = true;
          }
        });
        if (findItem) {
          const style = {
            'border': '1px solid #573790 '
          };
          return style;
        } else {
          const myStyles = {
            'border': '1px solid #573790 ',
            'opacity': '0.5'
          };
          return myStyles;
        }
      } else {
        const myStyles = {
          'border': '1px solid #573790 '
        };
        return myStyles;
      }
    } else {                            // obje tipi class değil ise kesikli çizgi
      if (this.dependencyStatus === true) {
        let findItem = false;
        this.dependencySelectedItems.forEach((item) => {
          if (item.id === table.id) {
            findItem = true;
          }
        });
        if (findItem) {
          const style = {
            'border': '1px dotted #573790 '
          };
          return style;
        } else {
          const myStyles = {
            'border': '1px dotted #573790 ',
            'opacity': '0.5'
          };
          return myStyles;
        }
      } else {
        const myStyles = {
          'border': '1px dotted #573790 '
        };
        return myStyles;
      }
    }
  }

  private dependencyStatusChange(val: boolean) {
    this.dependencyStatus = val;
    this.dependencySelectedItems = [];
  }
}
