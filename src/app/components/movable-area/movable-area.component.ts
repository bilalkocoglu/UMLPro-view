import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Table} from '../../dto/table';
import {TableManagementService} from '../../services/table-management.service';
import {Property} from '../../dto/Property';
import {Function} from '../../dto/Function';
import {DependencyManagementService} from '../../services/dependency-management.service';
import {DOCUMENT} from '@angular/common';
import {Dependency} from '../../dto/Dependency';
import {Toast, ToastrService} from "ngx-toastr";
import {ApiClientService} from "../../services/api-client.service";

@Component({
  selector: 'abe-movable-area',
  templateUrl: './movable-area.component.html',
  styleUrls: ['./movable-area.component.scss']
})
export class MovableAreaComponent {
  tables: Table[] = [];
  dependencies: Dependency[] = [];

  dependencyStatus = false;
  dependencySelectedItems: Table[] = [];

  constructor(private tableManagement: TableManagementService,
              private dependencyManagement: DependencyManagementService,
              private elementRef: ElementRef,
              private toastr: ToastrService,
              private apiClient: ApiClientService) {
    this.tableManagement.tableChange.subscribe((tables) => {
      this.tables = tables;
    });

    this.dependencyManagement.refleshDependency.subscribe((dependencyList) => {
      this.dependencies = dependencyList;
    });

    this.dependencyManagement.depencencyIsActive.subscribe((val) => this.dependencyStatusChange(val));

    this.apiClient.runHerokuService().subscribe();    //herokuda servisin çalıştırılması için !
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
          if (this.dependencySelectedItems[0].type == 'interface' && this.dependencySelectedItems[1].type == 'class') {
            this.toastr.error('You mustn\'t create dependency between interface and class !','Create Dependency Error');
          } else {
            this.dependencyManagement.addNewDependency(this.dependencySelectedItems);
          }
          this.dependencySelectedItems = [];
          this.dependencyStatus = false;
        }
      }
    } else {
      return;
    }
  }

  getCustomStyle(table: Table) {
    if (table.type === 'class') {       // obje tipi class ise düz çizgi
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

  getX1(tableId: string) {
    const element = document.querySelector('#' + tableId);
    return element.getBoundingClientRect().left - 35 + (element.getBoundingClientRect().width/2);
  }
  getY1(tableId: string) {
    const element = document.querySelector('#' + tableId);
    return element.getBoundingClientRect().top - 35 + (element.getBoundingClientRect().height/2);
  }
  getX2(tableId: string) {
    const element = document.querySelector('#' + tableId);
    return element.getBoundingClientRect().left-35 + (element.getBoundingClientRect().width/2);
  }
  getY2(tableId: string) {
    const element = document.querySelector('#' + tableId);
    return element.getBoundingClientRect().top - 35 + (element.getBoundingClientRect().height/2);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
