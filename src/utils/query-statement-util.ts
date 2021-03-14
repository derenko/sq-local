import { StorageConnector } from '@app/storage';
import { v4 as uuid } from 'uuid';
import { isDeepEquality } from '@app/utils/deep-equality';
import { filter, pick } from 'lodash';
import { BaseModel } from '@app/model';

export class QueryStatementUtil<T> {
  private readonly storage = new StorageConnector();
  constructor(private readonly tableName: string){};

  createId(){
    return uuid();
  }

  get(){
    return <Array<T>>this.storage.get(this.tableName)
  }

  getTableToPopulate<I>(tableName: string){
    return <Array<I>>this.storage.get(tableName)
  }

  set(...rest: any){
    return this.storage.set(this.tableName, ...rest)
  }

  remove(){
    return this.storage.remove(this.tableName);
  }

  /**
   *  Takes query and compare all records in table with query 
   *  using dirty (JSON stringify) equality,
   *  then remove all keys which is not in query,
   *  compare and return indexes of elements which is 
   *  satisfy query and return that array
   */

  findRecordsIndexesByQuery(query: Partial<T>){
    const keys = Object.keys(query);
    const indexes: Array<number>  = [];
   
    const records = this.get().map(record => pick(record, keys));

    records.map((record, index) => isDeepEquality(record, query) ? indexes.push(index) : null );

    return indexes;
  }

  /**
   * Takes indexes and return records in table which have same indexes  
   */

  findRecordsByIndexes(indexes: Array<number>){
    const result = this.get().filter((_, index) => indexes.includes(index))

    return result; 
  }

  /**
   * Takes indexes and return records in table which doesnt have those indexes  
   */

  findRecordsNotInIndexes(indexes: Array<number>){
    const result = this.get().filter((_, index) => !indexes.includes(index));

    return result;
  }

  updateByIndexes(indexes: Array<number>, values: Partial<Omit<T, keyof BaseModel>>){
    const updated: Array<T> = []
    const records = this.get();

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

  selectColumns(records: T[], columns?: Array<keyof T>): Array<T> | Array<Partial<T>>{
    return columns ? records.map(record => pick(record, columns)) : records;
  }

  populateRecords<I>(property: keyof T, populateFrom: Array<T> | Array<Partial<T>>, populateWith: Array<I>){
    const result = populateFrom.map((populateFromRecord: T) => {
      const _id = populateFromRecord[property] ? populateFromRecord[property] : null;

      const [ populateWithRecord ] = <Array<I>>filter(populateWith, { _id })
      
      return {
        ...populateFromRecord,
        [property]: populateWithRecord ? populateWithRecord : null
      }
    })

    return result;
  }
}