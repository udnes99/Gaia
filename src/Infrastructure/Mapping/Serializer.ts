
import { AwilixContainer } from "awilix";

import { IMapper, DTO } from "../../Contracts/Mapper/IMapper";
import stringify from "json-stringify-deterministic";
import { Class, ISerializer } from "../../Contracts/Serializer/ISerializer";
import { Schema } from "zod";


export class Serializer implements ISerializer
{
    constructor
    (
        private readonly container : AwilixContainer
    ) {Serializer.instance = this;}
    public isKnownType(type: string | Class<unknown>): boolean 
    {
        type = typeof type !== "string" ? type.name : type;
        
        return this.container.hasRegistration(type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper");
    }
    public getMapper<T extends IMapper<unknown, unknown>>(type: string, ): T 
    {
        return this.container.resolve<T>(type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper", {allowUnregistered: true})
    }


    private static instance : Serializer
    public static getInstance() : Serializer
    {
        return this.instance;
    }
    public serialize<T>(obj: T)  : DTO<T>
    {
        let result : DTO<T>;

        if((typeof obj === "object"))
        {
            const type : string = obj.constructor.name;

            const mapper = this.container.resolve<IMapper<any, any>>(type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper", {allowUnregistered: true})
            if(!mapper)
            {
                console.warn(`[Serialization]: Mapper not found for ${type}`);
                result = {};
                Object.keys(obj).forEach(x => result[x] = this.serialize(obj[x]));
            }
            else
                result = mapper.to(obj)
            
        }
        else if(Array.isArray(obj))
                result = obj.map(x => this.serialize(x))
            else
                result = obj;
        return result
    }

    public serializeJSON<T>(obj: T) : string
    {
        return stringify(this.serialize(obj));
    }

    public serializeJSONBuffer<T>(obj: T) : Buffer
    {
        return Buffer.from(this.serializeJSON(obj));
    }

    public deserialize<T>(type: Class<T> | string, dto: DTO<T>) : T
    {
        type = typeof type !== "string" ? type.name : type;
        const mapper = type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper";
        if(!this.container.hasRegistration(mapper))
            throw new Error("Missing mapper for object of type " + type);
        const schema = this.container.resolve<Schema<unknown, unknown>>(type.substring(0,1).toLowerCase() + type.substring(1) + "Schema", {allowUnregistered: true});
        if(!schema)
            console.warn("Missing schema for deserialized type: ", type);
        else
            schema.parse(dto);
        
        return this.container.resolve<IMapper<T, DTO<T>>>(mapper).from(dto);
    }

    public deserializeJSON<T>(type: Class<T> | string, json: string) : T
    {
        return this.deserialize(type, JSON.parse(json));
    }


    public deserializeJSONBuffer<T>(type: Class<T> | string, buffer: Buffer | Uint8Array) : T
    {
        return this.deserializeJSON(type, Buffer.from(buffer).toString("utf-8"));
    }
}