import { QueryStatementUtil } from '@app/utils/query-statement-util';
import { BaseModel } from '@app/base-model';
import { WhereQueryConstraints } from '@app/query-statement/types';
import orderBy from 'lodash/orderBy';

export class QueryStatement<T> {
  private readonly queryStatementUtil = new QueryStatementUtil<T>(this.tableName);
  private result: Array<T> | Array<Partial<T>> = [];

  constructor( private readonly tableName: string ){}

  execute(logResult: boolean = false){
    const result = [...this.result];
    this.result = [];

    if(logResult){
      console.log(result)
    }

    return result;
  }

  insert(records: Omit<T, keyof BaseModel>[]){
    const inserted = records.map(record => {
      const _id = this.queryStatementUtil.createId(); 

      return { 
        _id, 
        ...record
      }
    })

    this.queryStatementUtil.set(...inserted);

    return inserted;
  }

  delete(query: Partial<T>){
    const indexes = this.queryStatementUtil.findRecordsIndexesByQuery(query);
    const result = this.queryStatementUtil.findRecordsNotInIndexes(indexes);
    const deleted = this.queryStatementUtil.findRecordsByIndexes(indexes);

    this.queryStatementUtil.remove();
    this.queryStatementUtil.set(...result);

    return deleted;
  }

  update(query: Partial<T> , values: Partial<Omit<T, keyof BaseModel>>){
    const indexes = this.queryStatementUtil.findRecordsIndexesByQuery(query);
    const [records, updated] = this.queryStatementUtil.updateByIndexes(indexes, values);

    this.queryStatementUtil.remove();
    this.queryStatementUtil.set(...records);

    return updated;
  }

  find(query: Partial<T>, columns?: Array<keyof T>){
    const indexes = this.queryStatementUtil.findRecordsIndexesByQuery(query);
    const finded = this.queryStatementUtil.findRecordsByIndexes(indexes);

    this.result = this.queryStatementUtil.selectColumns(finded, columns);

    return this;
  }

  where(property: keyof T, constraint: WhereQueryConstraints, value: any){
    switch(constraint){
      case('='):
        this.result = this.result.filter(record => record[property] === value );
        break;
      case('>'):
        this.result = this.result.filter(record => record[property] > value );
        break;
      case('<'):
        this.result = this.result.filter(record => record[property] < value);
        break;
      case('<='):
        this.result = this.result.filter(record => record[property] <= value);
        break;
      case('>='):
        this.result = this.result.filter(record => record[property] >= value);
        break;
      case('!='):
        this.result = this.result.filter(record => record[property] !== value);
        break;
      default: 
        this.result = this.result;
        break;
    }

    return this;
  }

  sort(property: keyof T, order: 'asc' | 'desc' = 'desc'){
    this.result = orderBy(this.result, property, order);

    return this;
  }

  first(){
    this.result = [this.result[0]];

    return this;
  }

  limit(limit: number){
    this.result = this.result.splice(0, limit);

    return this;
  }

  offset(offset: number){
    this.result = this.result.splice(offset, this.result.length - 1);

    return this;
  }

  /**
   * MongoDB like populate
   * populate records from one table to other.
   * 
   * @Tip
   * If you use populate you should always select property in find method
   * by which you want populate to
   */

  populate<I extends BaseModel>(property: keyof T, tableName: string, populatedOnly: boolean = false){
    const populateFrom = this.result;
    const populateWith = this.queryStatementUtil.getTableToPopulate<I>(tableName);

    const result = this.queryStatementUtil
    .populateRecords<I>(property, populateFrom, populateWith)
    .filter(record => populatedOnly ? record.pet : true)

    this.result = result;

    return this;
  }
} 