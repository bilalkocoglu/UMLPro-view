import {Table} from './table';
import {Dependency} from './Dependency';

export class GenerateRequestDTO {
  language: string;
  isConstructor: boolean;
  isGetterSetter: boolean;
  isLombok: boolean;
  tableList: Table[];
  dependencyList: Dependency[];
}
