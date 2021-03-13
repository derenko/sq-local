export class Serializer {
  private validate(){
    return 0;
  }

  static serialize(value: Record<string, any>){
    return JSON.stringify(value);
  }

  static deserialize(value: string) {
    return JSON.parse(value);
  }
}