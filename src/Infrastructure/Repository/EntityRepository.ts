import { Context } from "fabric-contract-api";
import { Iterators } from "fabric-shim";
import { Entity } from "../../Core/Entity";
import { OneOrNone } from "../../Types/OneOrMany";
import { PrimitiveField } from "../../Types/PrimitiveField";
import { Serializer } from "../Mapping/Serializer";
import { createHash } from "crypto"


export type Query = Record<string, PrimitiveField>

import stringify from "json-stringify-deterministic";

export abstract class EntityRepository<T extends Entity>
{
    constructor
    (
        protected readonly ctx: Context,
        protected readonly serializer : Serializer,
    ) {}

    


    protected readonly saved : Set<string> = new Set();
    protected readonly deleted : Set<string> = new Set();

    
    public save(...entities: T[]) : Promise<void>
    {
        return this.internalSave(entities);
    }
    protected abstract internalSave(entities: T[]) : Promise<void>

    protected getImplicitPrivateDataCollection(org?: string)
    {
        return `_implicit_org_${org ?? this.ctx.clientIdentity.getMSPID()}`;
    }

    protected getEntityType()
    {
        return this.constructor.name.substring(0, this.constructor.name.indexOf("Repo"));
    
    }

    protected async getImplicit(id: string) : Promise<OneOrNone<T>>
    {
        const lookupResult = await this.ctx.stub.getPrivateData(this.getImplicitPrivateDataCollection(), id);
            if(lookupResult.length > 0)
                return this.serializer.deserializeJSONBuffer<T>(this.getEntityType(), lookupResult);
    }

    protected async getPrivate(collection: string, id: string) : Promise<OneOrNone<T>>
    {
        const lookupResult = await this.ctx.stub.getPrivateData(collection, id);
        if(lookupResult.length > 0)
            return this.serializer.deserializeJSONBuffer<T>(this.getEntityType(), lookupResult);
    }

    protected async getPublic(id: string) : Promise<OneOrNone<T>>
    {
        const lookupResult = await this.ctx.stub.getState(id);
        if(lookupResult.length > 0)
            return this.serializer.deserializeJSONBuffer<T>(this.getEntityType(), lookupResult);
    }

    protected async getAllImplicit() : Promise<T[]>
    {
        return await this.iteratorToEntities(this.ctx.stub.getPrivateDataByRange(this.getImplicitPrivateDataCollection(), "", ""))
    }

    protected async getAllPrivate(collection: string) : Promise<T[]>
    {
        return await this.iteratorToEntities(this.ctx.stub.getPrivateDataByRange(collection,"", ""));
    }

    protected async getAllPublic() : Promise<T[]>
    {
        return await this.iteratorToEntities(this.ctx.stub.getStateByRange("", ""));
    }



    
    protected async queryImplicit(query? : Query) : Promise<T[]>
    {
        return  await  this.iteratorToEntities(this.ctx.stub.getPrivateDataQueryResult(this.getImplicitPrivateDataCollection(), stringify({selector: {...query, "~type": this.getEntityType()}}))); 
    }

    protected async queryPublic( query : Query) : Promise<T[]>
    {
        return  await  this.iteratorToEntities(this.ctx.stub.getQueryResult(stringify({selector: {...query, "~type": this.getEntityType()}}))); 
    }

    protected async queryPrivate(collection: string, query: Query) : Promise<T[]>
    {
        return await this.iteratorToEntities(this.ctx.stub.getPrivateDataQueryResult(collection, stringify({selector: {...query, "~type": this.getEntityType()}})));
    }

    private cacheSave(collection: string, entities: T[])
    {
        for(const entity of entities)
        {
            this.saved.add(`${collection}-${entity.id}`);
            this.deleted.delete(`${collection}-${entity.id}`);
        }
    }

    private cacheDeletion(collection: string, entities: T[])
    {
        for(const entity of entities)
        {
            this.saved.delete(`${collection}-${entity.id}`);
            this.deleted.add(`${collection}-${entity.id}`);
        }   
    }

    protected computeHashOf(entity: T)
    {
        const sha256 = createHash("sha256");
        sha256.update(this.entityToBuffer(entity));
        return sha256.digest();
    }

    private entityToBuffer(entity: T)
    {
        const dto = this.serializer.serialize(entity);
        dto["~type"] = this.getEntityType();
        return Buffer.from(stringify(dto));
    }

    protected async saveImplicit(...entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.putPrivateData(this.getImplicitPrivateDataCollection(), x.id, this.entityToBuffer(x))));
        this.cacheSave(this.getImplicitPrivateDataCollection(), entities);
    }

    protected async savePublic(...entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.putState(x.id, this.entityToBuffer(x))))
        this.cacheSave("", entities);
    }

    protected async savePrivate(collection: string, ...entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.putPrivateData(collection, x.id, this.entityToBuffer(x))));
        this.cacheSave(collection, entities);
    }

    protected async deleteImplicit(entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.deletePrivateData(this.getImplicitPrivateDataCollection(), x.id)));
        this.cacheDeletion(this.getImplicitPrivateDataCollection(), entities);
    }

    protected async deletePublic(entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.deleteState(x.id)));
        this.cacheDeletion("", entities);
    }

    protected async deletePrivate(collection: string, entities: T[])
    {
        await Promise.all(entities.map(x => this.ctx.stub.deletePrivateData(collection, x.id)));
        this.cacheDeletion(collection, entities);
    }


    private async iteratorToEntities(iterator: Promise<Iterators.StateQueryIterator> & AsyncIterable<Iterators.KV>) : Promise<T[]>
    {
        const results : T[] = [];
        for await(const res of iterator)
        {
            const data = JSON.parse(Buffer.from(res.value).toString("utf-8"));
            if(data["~type"] !== this.getEntityType())
                continue;
            const entity = this.serializer.deserialize<T>(this.getEntityType(), data)
            results.push(entity);
        }
        return results;
    }


    protected async existsImplicit(id: string) : Promise<boolean>
    {
        if(this.saved.has(id))
            return true;
        
        const lookupResult = await this.ctx.stub.getPrivateData(this.getImplicitPrivateDataCollection(), id);
        return lookupResult.length != 0;
}

    protected async existsPrivate(collection: string, id: string) : Promise<boolean>
    {
        if(this.saved.has(id))
            return true;
        const lookupResult = await this.ctx.stub.getPrivateData(collection, id);
        return lookupResult.length != 0;
    }

    protected async existsPublic(id: string) : Promise<boolean>
    {
        if(this.saved.has(id))
            return true;
        const lookupResult = await this.ctx.stub.getState(id);
        return lookupResult.length != 0;
    }

}