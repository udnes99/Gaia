import { ActivityId } from "../../Core/Activity/ActivityId";
import { AssetId } from "../../Core/Asset/AssetId";

export class InvolvementRegistration
{
    constructor
    (
        readonly assets: AssetId[],
        readonly activity: ActivityId
    ) {}
}