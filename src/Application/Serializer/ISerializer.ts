import { DTO } from "../Mapping/IMapper";


export declare type Class<T = any> = new (...args: any[]) => T;


export interface ISerializer
{
    serialize<T>(obj: T)  : DTO<T>   
    deserialize<T>(type: Class<T> | string, dto: DTO<T>) : T
}
