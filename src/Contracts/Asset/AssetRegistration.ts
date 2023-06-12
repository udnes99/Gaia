import { ActivityRecord } from "../../Core/Asset/ActivityRecord";
import { OrganizationId } from "../../Core/Organization/OrganizationId";
import { PrimitiveObject } from "../../Types/PrimitiveField";

export class AssetRegistration
{
    constructor
    ( 
        readonly assets: 
        {
            readonly id: string,
            readonly type: string,
            readonly fractional: boolean,
            readonly activities?: ActivityRecord[],
            readonly previousOwner?: OrganizationId,
            readonly composedOf?: Record<string, number>,
            readonly data?: PrimitiveObject
        }[]
        
    ) {}

}