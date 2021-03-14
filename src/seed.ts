import { SQLocal } from "@app/sqlocal";
import { BaseModel } from "@app/model";

export const db = new SQLocal();

export interface User extends BaseModel {
  name: string,
  age: number,
  sex: string,
  pet?: string | Pet
}

export interface Pet extends BaseModel {
  name: string
}

export const users = db.table<User>('users');
export const pets = db.table<Pet>('pets');

export function seed(){
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

  users.query.update({_id: bill._id}, {pet: jack._id});
  users.query.update({_id: jhon._id}, {pet: boo._id});
  users.query.update({_id: evan._id}, {pet: batman._id});
  
  users.query.find({sex: 'male'}, ['age', 'pet']).populate<Pet>('pet', 'pets').execute()
}

