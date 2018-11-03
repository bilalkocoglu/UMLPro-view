import {EventEmitter, Injectable, Output} from '@angular/core';
import {Table} from '../table';
import {Property} from '../Property';
import {Function} from '../Function';

@Injectable({
  providedIn: 'root'
})
export class TableManagementService {
  @Output() tableChange = new EventEmitter<Table[]>();

  private tables: Table[] = [];
  private id = 1;
  private searchIndex;


  addTable(objectName: string, objectType: string) {
    // console.log( this.id + '. kez ekle çalıştı ! => Service');
    const table = new Table();
    table.id = this.id;
    table.name = objectName;
    table.type = objectType;
    table.propertyIdCount = 1;
    table.functionIdCount = 1;

    const property = new Property();
    property.id = table.propertyIdCount;
    property.access = '+';

    table.properties = [property];

    const fun: Function = new Function();
    fun.id = table.functionIdCount;
    fun.access = '+';

    table.functions = [fun];

    this.id++;

    this.tables.push(table);
    this.tableChange.emit(this.tables);
  }

  public setTables (tables: Table[]) {
    // console.log('Set Tables e gelen parametre => ', tables);
    this.tables = tables;
  }

  public getTables (): Table[] {
    return this.tables;
  }
  public getTable(id: number): Table {
    this.tables.forEach((table, index) => {
      if (table.id === id) {
        this.searchIndex = index;
      }
    });
    return this.tables[this.searchIndex];
  }
}
