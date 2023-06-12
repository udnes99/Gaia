import { DTO, IMapper } from "../Mapper/IMapper";




export declare type Class<T = any> = new (...args: any[]) => T;


export interface ISerializer
{
    serialize<T>(obj: T)  : DTO<T>   
    serializeJSON<T>(obj: T) : string
    serializeJSONBuffer<T>(obj: T) : Buffer
    deserialize<T>(type: Class<T> | string, dto: DTO<T>) : T
    deserializeJSON<T>(type: Class<T> | string, json: string) : T
    deserializeJSONBuffer<T>(type: Class<T> | string, buffer: Buffer | Uint8Array) : T
    isKnownType(type: Class<unknown> | string) : boolean
    getMapper<T extends IMapper<unknown, unknown>>(type: string)  : T
}
