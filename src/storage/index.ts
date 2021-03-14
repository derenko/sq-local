import { Serializer } from '@app/utils/serizalizer';

export interface IStorageConnector {
  readonly storage: Storage,

  set(key: string, value: any): Record<string, any>
  get(key: string): Record<string, any>[]
  remove(key: string): void
  keys(): string[]
}

export class StorageConnector implements IStorageConnector {
  constructor(readonly storage = localStorage){}

  set(key: string, ...rest: any){
    this.storage.setItem(key, Serializer.serialize([...this.get(key), ...rest]));
    return this.get(key);
  }

  get(key: string){
    const records: Array<Record<string, any>> = Serializer.deserialize(this.storage.getItem(key)); 
    return records ? records : [];
  }

  remove(key: string){
    this.storage.removeItem(key);
  }

  keys(){
    return Object.keys(this.storage);
  }
}