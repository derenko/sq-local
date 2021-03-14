import { BaseModel } from '@app';
import { SQLocal } from '@app';

const db = new SQLocal();

interface User extends BaseModel {
  name: string,
  age: number,
  sex: string,
  pet?: string | string[] | Pet | Pet[]
}

interface Pet extends BaseModel {
  name: string
}

const users = db.table<User>('users');
const pets = db.table<Pet>('pets');

export function insertQuerySeed(){
  const [ bill, jhon, miranda, evan ] = users.query.insert(
    [
      { name: 'Bill', age: 20, sex: 'male' }, 
      { name: 'Jhon', age: 25, sex: 'male' },
      { name: 'Miranda', age: 47, sex: 'female' },
      { name: 'Evan', age: 29, sex: 'male' }, 
      { name: 'Stew', age: 25, sex: 'male' },
      { name: 'Kate', age: 34, sex: 'female' },
      { name: 'Patrick', age: 18, sex: 'male' }, 
      { name: 'Victor', age: 43, sex: 'male' },
      { name: 'Karen', age: 20, sex: 'female' }
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
  users.query.find({sex: 'male'}, ['name', 'pet']).populate<Pet>('pet', 'pets', true).execute(true);
}

