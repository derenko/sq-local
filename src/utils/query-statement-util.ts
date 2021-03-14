import { StorageConnector } from '@app/storage';
import { v4 as uuid } from 'uuid';
import { isDeepEquality } from '@app/utils/deep-equality';
import pick from 'lodash/pick';
import { BaseModel } from '@app/base-model';

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

    records.forEach((record, index) => {
      if(isDeepEquality(record, query)) indexes.push(index);
    });

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

  populateRecords<I extends BaseModel>(property: keyof T, populateFrom: Array<T> | Array<Partial<T>>, populateWith: Array<I>){
    return populateFrom.map((populateFromRecord: T) => {
      const _id = populateFromRecord[property] ? populateFromRecord[property] : null as string | null; 
      
      const populateWithRecords = populateWith.filter(record => {
        const recordId = record._id;
        return Array.isArray(_id) ? _id.includes(recordId) : recordId === _id;
      });

      const populateWithRecord = !Array.isArray(_id) ? populateWithRecords[0] : populateWithRecords;

      return {
        ...populateFromRecord,
        [property]: populateWithRecord ? populateWithRecord : null
      }
    })
  }
}