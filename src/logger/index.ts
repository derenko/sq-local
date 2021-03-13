interface ILogger {
  time(): string
  log(message: string): void,
  format(message: string): string
}

export class Logger implements ILogger{
  constructor(private transport: Console = console){}

  time(){
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  }

  format(message: string) {
    return `[${this.time()}] - ${message}`;
  }

  log(message: string): void{
    this.transport.log(this.format(message));
  }
}