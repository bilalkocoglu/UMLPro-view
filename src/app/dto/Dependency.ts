import {Table} from './table';

export class Dependency {
  from: Table;
  destination: Table;
  relation: string;
}
