import { OneOrMany } from "../../Types/OneOrMany";
import { PrimitiveField } from "../../Types/PrimitiveField";
import { Outcome } from "../Outcome/Outcome";
import { ActivityId } from "./ActivityId";


export class Activity
{
    constructor
    (
        readonly id: ActivityId,
        readonly type: string,
        readonly outcome: OneOrMany<Outcome>,
        readonly description?: string,
        readonly assets: number = 0,
        readonly data?: Record<string, PrimitiveField>,
        readonly activities?: ActivityId[]
    ) {}

    public static registerNew(id: string,type: string, outcome: OneOrMany<Outcome>, description?: string, assets: number = 0, metadata?: Record<string, PrimitiveField>, activities?: ActivityId[])
    {
        return new Activity(id, type, outcome, description,assets, metadata, activities);
    }
}