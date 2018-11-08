import {Component, ViewEncapsulation} from '@angular/core';
import {TableManagementService} from '../../services/table-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DependencyManagementService} from '../../services/dependency-management.service';
import {Dependency} from '../../dto/Dependency';
import {FormControl, FormGroup} from '@angular/forms';
import {GenerateRequestDTO} from '../../dto/GenerateRequestDTO';
import {ApiClientService} from "../../services/api-client.service";
import {ToastrService} from "ngx-toastr";


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

  isConstructor = false;
  isGetterSetter = false;

  language = new FormControl('java');


  constructor(private tablesManagement: TableManagementService,
              private modalService: NgbModal,
              private dependencyManagement: DependencyManagementService,
              private apiClientService: ApiClientService,
              private toastr: ToastrService) {

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

  deleteDependency(dependency: Dependency) {
    this.dependencyManagement.deleteDependency(dependency);

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

  generate() {
    if (this.tablesManagement.getTables().length <= 0){
      this.toastr.error("Please create table", "Generate Error");
    } else {
      const generateReq: GenerateRequestDTO = new GenerateRequestDTO();
      generateReq.language = this.language.value;
      generateReq.isConstructor = this.isConstructor;
      generateReq.isGetterSetter = this.isGetterSetter;
      generateReq.tableList = this.tablesManagement.getTables();
      generateReq.dependencyList = this.dependencies;
      //console.log(generateReq);

      this.apiClientService.generateClient(generateReq).subscribe(
        response => {
          console.log(response);
        },
        error2 => {
          console.log(error2);
        }
      );
    }
  }
}


