export enum QueryConstraints {
  MoreThen = '>',
  LessThen = '<',
  LessOrEqual = '<=',
  MoreOrEqual = '>='
}

export class QueryResult<T> {
  constructor(private result: Array<T>){}

  where(property: keyof T, constraint: QueryConstraints, value: any){
    switch(constraint){
      case(QueryConstraints.MoreThen):
        return this.result.filter(record => {
          return record[property] > value 
        })
      case(QueryConstraints.LessThen):
        return this.result.filter(record => {
          return record[property] < value
        })
      case(QueryConstraints.LessOrEqual):
        return this.result.filter(record => {
          return record[property] <= value
        })
      case(QueryConstraints.MoreOrEqual):
        return this.result.filter(record => {
          return record[property] >= value
        })
      default: 
        return this.result
    } 
  }

  first(){
    return this.result[0]
  }
}