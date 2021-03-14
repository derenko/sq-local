import { Table } from '@app/table';

export class SQLocal {
  constructor(){}

  table<T>(tableName: string){
    return new Table<T>(tableName);
  }
}