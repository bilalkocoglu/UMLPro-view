import {Component, ViewEncapsulation} from '@angular/core';
import {TableManagementService} from '../../services/table-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DependencyManagementService} from '../../services/dependency-management.service';
import {Dependency} from '../../dto/Dependency';
import {FormControl, FormGroup} from '@angular/forms';
import {GenerateRequestDTO} from '../../dto/GenerateRequestDTO';
import {ApiClientService} from "../../services/api-client.service";
import {ToastrService} from "ngx-toastr";
import {Table} from "../../dto/table";
import {Observable} from "rxjs/Rx";
import {Router} from "@angular/router";
import {GenerateResponseDTO} from "../../dto/GenerateResponseDTO";
import {el} from "@angular/platform-browser/testing/src/browser_util";


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
  isLombok = false;

  language = new FormControl('java');

  fileUpload: Observable<string>;

  loading = false;

  constructor(private tablesManagement: TableManagementService,
              private modalService: NgbModal,
              private dependencyManagement: DependencyManagementService,
              private apiClientService: ApiClientService,
              private toastr: ToastrService,
              private router: Router) {

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
      this.objectType = 'interface';
    } else {
      this.objectType = 'class';
    }

    // OBJECT NAME CONTROL
    const emp: boolean = this.isEmptyOrSpace(this.objectName);

    if (emp) {
      this.toastr.error("We can not create new object if don't input object name.", "Create Object Error");
      this.modalService.dismissAll('Close click');
    }else {
      var isAllreadyObjectName = false;
      this.tablesManagement.getTables().forEach((table) => {
        if (table.name == this.objectName){
          isAllreadyObjectName = true;
        }
      });
      if (isAllreadyObjectName) {
        this.toastr.error("This object name already taken by different object.", "Create Object Error");
        this.modalService.dismissAll('Close click');
      }else {
        this.tablesManagement.addTable(this.objectName, this.objectType);
        this.modalService.dismissAll('Close click');
      }
    }

  }

  startDependencySelect() {
    if (this.tablesManagement.getTables().length < 2) {
      this.toastr.error('Must be minimum two objects !', 'Dependency Error');
    } else {
      this.dependencyStatus = true;
      this.dependencyManagement.setDependencyActive(true);
    }
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
    this.loading = true;
    if (this.tablesManagement.getTables().length <= 0){
      this.loading = false;
      this.toastr.error("Please create table !", "Generate Error");
      return;
    } else {
      var tables: Table[] = this.tablesManagement.getTables();
      tables.forEach((table, index) => {
        table.properties.forEach((prop, index) => {
          if (prop.type == null) {
            prop.type = "String";
          }
          if (prop.name == null) {
            table.properties.splice(index, 1);
          }
        });
        table.functions.forEach((fun, index) => {
          if (fun.type == null) {
            fun.type = "void";
          }
          if (fun.name == null) {
            table.functions.splice(index, 1);
          }
        });
      });
      const generateReq: GenerateRequestDTO = new GenerateRequestDTO();
      generateReq.language = this.language.value;
      generateReq.isConstructor = this.isConstructor;
      generateReq.isGetterSetter = this.isGetterSetter;
      generateReq.isLombok = this.isLombok;
      generateReq.tableList = this.tablesManagement.getTables();
      generateReq.dependencyList = this.dependencies;
      console.log(generateReq);

      this.apiClientService.generateClient(generateReq).subscribe(
        response => {
          var fileName = response.body.fileName;
          var generateResponse = new GenerateResponseDTO();
          generateResponse.fileName = fileName;
          this.apiClientService.getFileUrl(generateResponse).subscribe(
            res => {
              var link = res.body.fileName;
              console.log(res.body.fileName);
              window.open(link);
              /*
              var a = document.createElement('a');
              a.href = link;
              a.setAttribute('style', 'display:none');
              a.click();
              a.remove();
              */
              this.loading = false;
            }
          );
          },
        error2 => {
          this.toastr.error(error2, 'Generate Error');
          this.loading = false;
        }
      );
    }
  }
}


