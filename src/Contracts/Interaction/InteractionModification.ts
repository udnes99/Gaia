import { ActivityId } from "../../Core/Activity/ActivityId";
import { Interaction } from "../../Core/Interaction/Interaction";

export class InteractionModification
{
    constructor
    (
        readonly interaction: Interaction,
        readonly activities?: {remove?: ActivityId[], register?: ActivityId[]}
    ) {}
}

