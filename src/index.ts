import { StorageConnector } from '@app/storage';
import { Table } from '@app/table';
import { BaseModel } from '@app/model'; 
import { QueryConstraints } from '@app/query-result';

export class SQLocal {
  private readonly storage = new StorageConnector();

  getTable<T>(tableName: string){
    return new Table<T>(this.storage, tableName);
  }
}

const db = new SQLocal();

interface User extends BaseModel {
  name: string,
  age: number,
  sex: string
}

const users = db.getTable<User>('users');

// users.query.insert(
//   [
//     {name: 'Bill', age: 20, sex: 'male'}, 
//     {name: 'Jhon', age: 25, sex: 'male'},
//     {name: 'Miranda', age: 30, sex: 'female'}
//   ]
// )

console.log(users.query.find({ name: 'Bill' }).where('age', QueryConstraints.MoreThen, 20))
console.log(users.query.find({}).where('age', QueryConstraints.LessThen, 25))
console.log(users.query.find({}).where('age', QueryConstraints.LessOrEqual, 25))