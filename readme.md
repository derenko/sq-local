## SQLocal

### SQLocal is simple orm-like query for local-storage

### Basic Usage
`
  export const db = new SQLocal();  <br/>
  <br/>
  export interface User extends BaseModel {  <br/>
    name: string,  <br/>
    age: number,  <br/>
    sex: string,  <br/>
    pet?: string | Pet  <br/>
  }  <br/>
  <br/>
  export interface Pet extends BaseModel {  <br/>
    name: string  <br/>
  }  <br/>
  <br/>
  export const users = db.table<User>('users');  <br/>
  export const pets = db.table<Pet>('pets');  <br/>

`
##### Insert
` 
  const [ bill, jhon, miranda, evan ] = users.query.insert(  <br/>
    [  <br/>
      { name: 'Bill', age: 20, sex: 'male' },   <br/>
      { name: 'Jhon', age: 25, sex: 'male' },  <br/>
      { name: 'Miranda', age: 47, sex: 'female' },  <br/>
      { name: 'Evan', age: 29, sex: 'male' },   <br/>
      { name: 'Stew', age: 25, sex: 'male' },  <br/>
      { name: 'Kate', age: 34, sex: 'female' },  <br/>
      { name: 'Patrick', age: 18, sex: 'male' },   <br/>
      { name: 'Victor', age: 43, sex: 'male' },  <br/>
      { name: 'Karen', age: 20, sex: 'female' }  <br/> 
    ]  <br/>
  )  <br/>
  <br/>
  const [ jack, boo, batman ] = pets.query.insert( <br/>
    [ <br/>
      { <br/>
        name: 'Jack' <br/>
      }, <br/>
      { <br/>
        name: 'Boo' <br/>
      }, <br/>
      { <br/>
        name: 'Batman' <br/>
      } <br/>
    ] <br/>
  ) <br/>
`

#### Find
`
  users.query.find({}).execute() <br/>
  users.query.find({name: 'Bill'}).execute() <br/>
  user.query.find({name: 'Bill'}).where('age', '>', 20).execute() <br/>
  user.query.find({name: 'Bill'}).where('age', '>=', 40).execute() <br/>
  user.query.find({name: 'Bill'}).where('age', '!=', 30).execute() <br/>
  users.query.find({age: 20}).first().execute() <br/>
`

#### Delete 
`
  users.query.delete({ name: 'Bill' }).execute() <br/>
`

#### Update
`
  users.query.update({_id: bill._id}, {pet: jack._id}); <br/>
  users.query.update({_id: jhon._id}, {pet: boo._id}); <br/>
  users.query.update({_id: evan._id}, {pet: batman._id}); <br/>
`

#### Populate 
`
  users.query.find({ sex: 'male' }, ['age', 'pet']).populate<Pet>('pet', 'pets').execute() <br/>
`
