import { Activity } from "../../../Core/Activity/Activity"
import { ActivityId } from "../../../Core/Activity/ActivityId"
import { OutcomeDTO } from "../../../Infrastructure/Mapping/Outcome/OutcomeMapper"
import { OneOrMany } from "../../../Types/OneOrMany"
import { PrimitiveObject } from "../../../Types/PrimitiveField"
import { DTO } from "../../Mapping/IMapper"

export interface ActivityDTO extends DTO<Activity>
{
    id: string,
    type: string,
    outcome: OneOrMany<OutcomeDTO>,
    description?: string,
    activities?: ActivityId[]
    data?: PrimitiveObject,
    assets: number
}