import {EventEmitter, Injectable, Output} from '@angular/core';
import {Table} from '../dto/table';
import {Dependency} from '../dto/Dependency';
import {TableManagementService} from './table-management.service';
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class DependencyManagementService {

  @Output() depencencyIsActive = new EventEmitter<boolean>();
  @Output() addingDependency = new EventEmitter<Dependency>();
  @Output() refleshDependency = new EventEmitter<Dependency[]>();

  private dependencyActive = false;
  dependencies: Dependency[] = [];

  constructor(private tableManagement: TableManagementService,
              private toastr: ToastrService) { }

  setDependencyActive(val: boolean): void {
    if (val === true) {
      this.dependencyActive = val;
      this.depencencyIsActive.emit(val);
    }
  }

  addNewDependency(tables: Table[]) {
    const dependency: Dependency = new Dependency();
    dependency.from = this.tableManagement.getTable(tables[0].id);
    dependency.destination = this.tableManagement.getTable(tables[1].id);


    if (dependency.from.type === 'class' && dependency.destination.type === 'class') {
      dependency.relation = 'extends';
    }
    if (dependency.from.type === 'class' && dependency.destination.type === 'interface') {
      dependency.relation = 'implements';
    }
    if (dependency.from.type === 'interface' && dependency.destination.type === 'interface') {
      dependency.relation = 'extends';
    }

    let allreadyDependency = false;

    this.dependencies.forEach((dpn) => {
      if (dpn.from.id === dependency.from.id && dpn.destination.id === dependency.destination.id ) {
        console.log("Daha önce tanımlanmış bağımlılık.");
        allreadyDependency = true;
      }

      if (dpn.from.id == dependency.destination.id && dpn.destination.id == dependency.from.id) {
        console.log("Daha önce ters bir şekilde bağlanmış")
        allreadyDependency = true;
      }

      if (dependency.from.type == 'class' && dependency.destination.type == 'class') {
        if ((dpn.from.id == dependency.from.id) && (dpn.relation == 'extends') ) {
          console.log("Bir class bir kez extends yapabilir !");
          allreadyDependency = true;
        }
      }
    });

    if (!allreadyDependency) {
      this.dependencies.push(dependency);
      this.refleshDependency.emit(this.dependencies);
    } else {
      this.toastr.error('Doing a wrong operation !','');
    }
  }

  deleteTable(table: Table) {
    let count = 0;
    this.dependencies.forEach((dependency, index) => {
      if (dependency.from === table || dependency.destination === table) {
        count++;
      }
    });

    for (let i = 0; i < count ; i++ ) {
      this.dependencies.forEach((dependency, index) => {
        if (dependency.from === table || dependency.destination === table) {
          this.dependencies.splice(index, 1);
        }
      });
    }

    this.refleshDependency.emit(this.dependencies);
  }

  deleteDependency(dependency: Dependency) {
    this.dependencies.forEach( (dep, index) => {
      if (dep.from === dependency.from && dep.destination === dependency.destination) {
        this.dependencies.splice(index, 1);
        this.refleshDependency.emit(this.dependencies);
      }
    });
  }
}
