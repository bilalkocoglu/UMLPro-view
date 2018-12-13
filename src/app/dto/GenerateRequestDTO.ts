import {Table} from './table';
import {Dependency} from './Dependency';

export class GenerateRequestDTO {
  language: string;
  isConstructor: boolean;
  isGetterSetter: boolean;
  tableList: Table[];
  dependencyList: Dependency[];
}
