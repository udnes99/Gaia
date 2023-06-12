import { AssetId } from "../../Core/Asset/AssetId";
import { OrganizationId } from "../../Core/Organization/OrganizationId";

export class TransferRequest
{
    constructor
    (
        readonly to: OrganizationId,
        readonly assets: AssetId[],
        readonly from: OrganizationId,
    ) {}
}