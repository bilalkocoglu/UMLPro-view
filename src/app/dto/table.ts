import {Property} from './Property';
import {Function} from './Function';

export class Table {
  id: number;
  name: string;
  type: string;
  propertyIdCount: number;
  properties: Property[];
  functionIdCount: number;
  functions: Function[];
}
