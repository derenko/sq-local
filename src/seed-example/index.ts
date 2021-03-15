import { BaseModel, SQLocal } from '@app/index';

const db = new SQLocal();

interface User extends BaseModel {
  name: string,
  age: number,
  sex: string,
  pet?: string | string[] | Pet | Pet[],
  vip: boolean,
}

interface Pet extends BaseModel {
  name: string
}

const users = db.table<User>('users');
const pets = db.table<Pet>('pets');

export function insertQuerySeed(){
  const [ bill, jhon, miranda, evan ] = users.query.insert(
    [
      { name: 'Bill', age: 20, sex: 'male', vip: false }, 
      { name: 'Jhon', age: 25, sex: 'male', vip: false },
      { name: 'Miranda', age: 47, sex: 'female', vip: false },
      { name: 'Evan', age: 29, sex: 'male', vip: false }, 
      { name: 'Stew', age: 25, sex: 'male', vip: false },
      { name: 'Kate', age: 34, sex: 'female', vip: false },
      { name: 'Patrick', age: 18, sex: 'male', vip: false }, 
      { name: 'Victor', age: 43, sex: 'male', vip: false },
      { name: 'Karen', age: 20, sex: 'female', vip: false }
    ]
  )

  const [ jack, boo, batman ] = pets.query.insert(
    [
      {
        name: 'Jack'
      },
      {
        name: 'Boo'
      },
      {
        name: 'Batman'
      }
    ]
  );

  users.query.update({_id: bill._id}, {pet: [ jack._id, boo._id ]});
  users.query.update({_id: jhon._id}, {pet: boo._id});
  users.query.update({_id: evan._id}, {pet: batman._id});
}

export function findQuerySeed(){
  users.query.find({}).execute();
  users.query.find({}, ['_id', 'name', 'age']).where('age', '>', 30).execute(true);
  users.query.find({}, ['_id', 'name', 'vip']).limit(5).execute(true);
  users.query.find({sex: 'male'}, ['name', 'pet']).populate<Pet>('pet', 'pets', true).execute(true);
}

export function updateQuerySeed(){
  users.query.update({name: 'Jhon'}, {age: 60})
  users.query.update({name: 'Bill'}, {name: 'Bill Evans', age: 30})
}

export function deleteQuerySeed(){
  users.query.delete({ name: 'Bill Evans' });
}

export function seed(){
  insertQuerySeed();
  findQuerySeed();
  updateQuerySeed();
  deleteQuerySeed();
}
