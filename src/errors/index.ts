class BaseError extends Error {
  constructor(){
    super();
    this.name = 'SQLocal_Error';
    this.message = 'uncaught error in SQLocal';
  }
}

export class TableAlreadyExistsError extends BaseError{
  constructor(private tablename: string){
    super();
    this.message = `Table ${this.tablename} already exists`;
  }
}

export class TableDoesntExistsError extends BaseError{
  constructor(private tablename: string){
    super();
    this.message = `Table ${this.tablename} doesnt exists`;
  }
}

export class InvalidJSON extends BaseError {
  constructor(){
    super();
    this.message = `Invalid JSON`;
  }
}