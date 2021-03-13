## SQLocal

### SQLocal is simple orm-like query for local-storage

### Basic Usage

##### Insert
`users.query.insert(
  [
    {name: 'Bill', age: 20, sex: 'male'}, 
    {name: 'Jhon', age: 25, sex: 'male'},
    {name: 'Miranda', age: 30, sex: 'female'}
  ]
)`

##### Insert
`users.query.insert(
  [
    {name: 'Bill', age: 20, sex: 'male'}, 
    {name: 'Jhon', age: 25, sex: 'male'},
    {name: 'Miranda', age: 30, sex: 'female'}
  ]
)`

#### Find
`
  users.query.find({})
  users.query.find({name: 'Bill'})
  user.query.find({name: 'Bill'}).where('age', '>', 20)
  users.query.find({age: 20}).first()
`

#### Delete 
`
  users.query.delete({name: 'Bill'})
`

#### Update
`
  users.query.update({name: 'Bill'}, { age: 20 })
`

