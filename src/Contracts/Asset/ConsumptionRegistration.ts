import { ActivityId } from "../../Core/Activity/ActivityId";
import { AssetId } from "../../Core/Asset/AssetId";
import { Consumption } from "../../Core/Asset/Consumption";

export class ConsumptionRegistration
{
    constructor
    (
        readonly assets: Record<AssetId, Consumption>,
        readonly activity?: ActivityId
    ) {}
}