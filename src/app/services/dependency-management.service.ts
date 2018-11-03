import {EventEmitter, Injectable, Output} from '@angular/core';
import {Table} from '../table';
import {Dependency} from '../Dependency';
import {TableManagementService} from './table-management.service';

@Injectable({
  providedIn: 'root'
})
export class DependencyManagementService {

  @Output() depencencyIsActive = new EventEmitter<boolean>();
  @Output() addingDependency = new EventEmitter<Dependency>();
  @Output() refleshDependency = new EventEmitter<Dependency[]>();

  private dependencyActive = false;
  dependencies: Dependency[] = [];

  constructor(private tableManagement: TableManagementService) { }

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


    if (dependency.destination.type === 'Class') {
      dependency.relation = 'extends';
    } else {
      dependency.relation = 'implements';
    }

    let allreadyDependency = false;

    this.dependencies.forEach((dpn) => {
      if (dpn.from.id === dependency.from.id && dpn.destination.id === dependency.destination.id ) {
        allreadyDependency = true;
      }
    });

    if (!allreadyDependency) {
      this.dependencies.push(dependency);
      this.refleshDependency.emit(this.dependencies);
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
