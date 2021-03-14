export class Serializer {
  private validate(){
    return;
  }

  static serialize(value: Record<string, any>){
    return JSON.stringify(value);
  }

  static deserialize(value: string) {
    return JSON.parse(value);
  }
}