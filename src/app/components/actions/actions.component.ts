import {Component, ViewEncapsulation} from '@angular/core';
import {TableManagementService} from '../../services/table-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DependencyManagementService} from '../../services/dependency-management.service';
import {Dependency} from '../../Dependency';


@Component({
  selector: 'abe-actions',
  templateUrl: './actions.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  closeResult: string;

  objectName: string;
  objectType = 'Class';

  dependencyStatus = false;
  dependencies: Dependency[] = [];

  constructor(private tablesManagement: TableManagementService,
              private modalService: NgbModal,
              private dependencyManagement: DependencyManagementService) {

    this.dependencyManagement.refleshDependency.subscribe((dependencies) => {
      this.dependencies = [];
      this.dependencies = dependencies;
    });
  }

  openModal(content) {
    // console.log('Action => Ekle Çalıştı !');
    this.objectName = null;
    this.objectType = 'Class';
    this.modalService.open(content, { centered: true });
  }

  addTable() {
    // console.log(this.objectName + ' ' + this.objectType);

    // OBJECT TYPE CONTROL
    if (this.objectType === '2') {
      this.objectType = 'Interface';
    } else {
      this.objectType = 'Class';
    }

    // OBJECT NAME CONTROL
    const emp: boolean = this.isEmptyOrSpace(this.objectName);

    if (emp) {
      this.objectName = 'undefined';
    }

    this.tablesManagement.addTable(this.objectName, this.objectType);
    this.modalService.dismissAll('Close click');
  }

  startDependencySelect() {
    this.dependencyStatus = true;
    this.dependencyManagement.setDependencyActive(true);
  }

  viewTables() {
    console.log(this.tablesManagement.getTables());
  }


  closeCentered() {
    this.modalService.dismissAll('Close click');
  }

  private isEmptyOrSpace(value: string): boolean {
    return value == null || value.match(/^ *$/) !== null;
  }

  private addingNewDependency(dependency: Dependency) {
    console.log(this.dependencies);
    this.dependencies.push(dependency);
    this.dependencyStatus = false;
  }
}


