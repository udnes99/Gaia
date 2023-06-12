import { PrimitiveObject } from "../../Types/PrimitiveField";
import { ActivityId } from "../Activity/ActivityId";
import { OrganizationId } from "../Organization/OrganizationId";
import { ActivityRecord } from "./ActivityRecord";
import { AssetId } from "./AssetId";
import { Consumption } from "./Consumption";




export class Asset
{
    constructor
    (
        public readonly id: AssetId,
        public readonly type: string,
        private _owner: OrganizationId,
       

        private _consumption : Consumption = false,

        private readonly _activities : ActivityRecord[] = [],

        private readonly _data?: PrimitiveObject,
        private readonly _composedOf?: Record<AssetId, number>,
        private readonly _previouseOwner?:  OrganizationId,

    ) {}

    
    public get data() : PrimitiveObject
    {
        return this._data;
    }

    public get activities() : Readonly<ActivityRecord[]>
    {
        return this._activities;
    }

    public get composedOf() : Record<AssetId, number> | undefined
    {
        return this._composedOf;
    }

    public get consumption() : Consumption
    {
        return this._consumption;
    }

    public get previousOwner() : OrganizationId
    {
        return this._previouseOwner;
    }

    public get owner() : OrganizationId
    {
        return this._owner;
    }

    public registerActivity(activity: ActivityId, consumption?: Consumption)
    {
        if(this._activities.some(x => x.activity === activity))
            throw new Error("Activity has already been registered");
        this._activities.push(new ActivityRecord(activity, false, consumption));
        if(consumption)
            this.consume(consumption)
    }

    public transferTo(newOwner: OrganizationId)
    {
        if(this._previouseOwner === newOwner)
            throw new Error("Invalid argument provided; new owner is identical to the current owner.")
        this._owner = newOwner;
    }

    public consume(consumption?: Consumption)
    {
        if(typeof consumption === "number")
        {
            if(typeof this._consumption === "boolean")
                throw new Error("Asset is not fractional");
            if(this._consumption + consumption > 1)
                throw new Error("Fraction exceeds the amount that can be consumed.");
            this._consumption += consumption;
            return;
        }
        if(this._consumption === true || this._consumption === 1)
            throw new Error("Asset has already been consumed.");

        this._consumption = true;    

        
    }
    public static register(id: string, type: string, owner: string,fractional: boolean,activities?: ActivityRecord[],data? : PrimitiveObject,previousOwner?: string,...composedOf: [Asset, number][]) : Asset
    {
        let composition : Record<AssetId, number> |  undefined;

        if(composedOf.length > 0)
        {
            composition = {};
            for(const [asset, fraction] of composedOf)
            {
                asset.consume(fraction);   
                composition[asset.id] = fraction;
            }
        }
        
        return new Asset(id, type, owner, fractional ? 0.0 : false, activities, data, composition, previousOwner);
    }






}