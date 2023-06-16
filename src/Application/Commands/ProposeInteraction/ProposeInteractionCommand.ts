import { ActivityId } from "../../../Core/Activity/ActivityId";
import { AssetId } from "../../../Core/Asset/AssetId";
import { OrganizationId } from "../../../Core/Organization/OrganizationId";
import { ICommand } from "../ICommand";

export class ProposeInteractionCommand implements ICommand<void>
{
    constructor
    (
        readonly id: string,
        readonly to: OrganizationId,
        readonly activities: Record<OrganizationId, ActivityId[]>,
        readonly transfers: Record<OrganizationId, AssetId[]>,
    ) {}
}