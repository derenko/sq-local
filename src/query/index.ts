import { StorageConnector } from '@app/storage';
import { isDeepEquality } from '@app/utils/deep-equality';
import { pick } from 'lodash';
import { v4 as uuid } from 'uuid';
import { BaseModel } from '@app/model';
import { QueryResult } from '@app/query-result';

export class QueryTool<T> {
  constructor(private storage: StorageConnector, private tableName: string){}

  private createId(){
    return uuid();
  }

  private _get(){
    return this.storage.get(this.tableName) as Array<T>
  }

  private _set(...rest: any){
    return this.storage.set(this.tableName, ...rest)
  }

  private _remove(){
    return this.storage.remove(this.tableName);
  }

  insert(records: Omit<T, keyof BaseModel>[]){
    
    const inserted = records.map(record => {
      const id = this.createId(); 

      return { 
        id, 
        ...record
      }
    })

    this._set(...inserted);

    return inserted;
  }

  delete(query: Partial<T>){
    const indexes = this._getQueryRecordsIndexes(query);
    const result = this._getTablesRecordsWithoutIndexes(indexes);
    const deleted = this._getTableRecordsWithIndexes(indexes);

    this._remove();
    this._set(...result);

    return deleted;
  }

  update(query: Partial<T> , values: Partial<Omit<T, keyof BaseModel>>){
    const indexes = this._getQueryRecordsIndexes(query);
    const [records, updated] = this._updateByIndexes(indexes, values);

    this._remove();
    this._set(...records);

    return updated;
  }

  find(query: Partial<T>){
    const indexes = this._getQueryRecordsIndexes(query);
    const result = this._getTableRecordsWithIndexes(indexes);

    return new QueryResult<T>(result)
  }

  /**
   *  Takes query and compare all records in table with query 
   *  using dirty (JSON stringify) equality,
   *  then remove all keys which is not in query,
   *  compare and return indexes of elements which is 
   *  satisfy query and return that array
   */

  private _getQueryRecordsIndexes(query: Partial<T>){
    const keys = Object.keys(query);
    const indexes: Array<number>  = [];
   
    const records = this._get().map(record => pick(record, keys));

    records.map((record, index) => isDeepEquality(record, query) ? indexes.push(index) : null );

    return indexes;
  }

  /**
   * Takes indexes and return records in table which have same indexes  
   */

  private _getTableRecordsWithIndexes(indexes: Array<number>){
    const result = this._get().filter((_, index) => indexes.includes(index))

    return result; 
  }

  /**
   * Takes indexes and return records in table which doesnt have those indexes  
   */

  private _getTablesRecordsWithoutIndexes(indexes: Array<number>){
    const result = this._get().filter((_, index) => !indexes.includes(index));

    return result;
  }

  private _updateByIndexes(indexes: Array<number>, values: Partial<Omit<T, keyof BaseModel>>){
    const updated: Array<T> = []
    const records = this._get();

    indexes.map(index => {
      const record = {
        ...records[index], 
        ...values
      }

      records[index] = record;
      updated.push(record);
    });

    return [records, updated];
  }
} 