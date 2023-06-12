import { ActivityId } from "../../Core/Activity/ActivityId";
import { AssetId } from "../../Core/Asset/AssetId";
import { OrganizationId } from "../../Core/Organization/OrganizationId";
import { ActivityRegistration } from "../Activity/ActivityRegistration";

export class InteractionProposal
{
    constructor
    (
        readonly id: string,
        readonly to: OrganizationId,
        readonly activities: Record<OrganizationId, ActivityId[]>,
        readonly transfers: Record<OrganizationId, AssetId[]>,
        readonly from?: OrganizationId
    ) {}
}