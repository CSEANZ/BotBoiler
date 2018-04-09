import { MemoryStorage, Storage } from "botbuilder";
import { injectable } from "inversify";


export interface IStorage{
    Storage:Storage
}

@injectable()
export default class MemoryStorageEx implements IStorage{
    public get Storage(){
        return new MemoryStorage();
    }
}