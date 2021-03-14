import { StorageConnector } from '@app/storage';
import { TableAlreadyExistsError, TableDoesntExistsError } from '@app/errors';
import { QueryStatement } from '@app/query-statement';

export class Table<T> {
  readonly query = new QueryStatement<T>(this.tableName);
  readonly storage = new StorageConnector();

  constructor(
    private tableName: string
  ){}

  private isExist(){
    return this.storage.get(this.tableName);
  }

  create(){
    if(this.isExist()){
      throw new TableAlreadyExistsError(this.tableName);
    }

    this.storage.set(this.tableName, []);
  }

  drop(){
    if(this.isExist()) return this.storage.remove(this.tableName);

    throw new TableDoesntExistsError(this.tableName);
  }
  
  showOne(){
    if(this.isExist()) return this.storage.get(this.tableName);

    throw new TableDoesntExistsError(this.tableName);
  }
}