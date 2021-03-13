import { StorageConnector } from '@app/storage';
import { TableAlreadyExistsError, TableDoesntExistsError } from '@app/errors';
import { QueryTool } from '@app/query';


export class Table<T> {
  readonly query = new QueryTool<T>(this.storage, this.tableName);

  constructor(private storage: StorageConnector, private tableName: string){}

  private isTableExist(){
    return this.storage.get(this.tableName);
  }

  create(){
    if(this.isTableExist()){
      throw new TableAlreadyExistsError(this.tableName);
    }

    this.storage.set(this.tableName, []);
  }

  drop(){
    if(this.isTableExist()) return this.storage.remove(this.tableName);

    throw new TableDoesntExistsError(this.tableName);
  }

  showAll(){
    return this.storage.keys();
  }

  showOne(){
    if(this.isTableExist()) return this.storage.get(this.tableName);

    throw new TableDoesntExistsError(this.tableName);
  }
}