import { DTO, IMapper } from "../../../Contracts/Mapper/IMapper";
import { Activity } from "../../../Core/Activity/Activity";
import { ActivityId } from "../../../Core/Activity/ActivityId";
import { Outcome } from "../../../Core/Outcome/Outcome";
import { OneOrMany } from "../../../Types/OneOrMany";
import { PrimitiveObject } from "../../../Types/PrimitiveField";
import { OutcomeDTO } from "../Outcome/OutcomeMapper";

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
export default class ActivityMapper implements IMapper<Activity, ActivityDTO>
{
    constructor
    (
        private readonly outcomeMapper : IMapper<Outcome, OutcomeDTO>
    ) {}
    public to(obj: Activity): ActivityDTO {
        return {
            id: obj.id,
            type: obj.type,
            outcome: Array.isArray(obj.outcome) ? obj.outcome.map(x => this.outcomeMapper.to(x)) : this.outcomeMapper.to(obj.outcome),
            description: obj.description,
            assets: obj.assets,
            activities: obj.activities,
            data: obj.data
        }
    }
    public from(dto: ActivityDTO): Activity {
        return new Activity(dto.id, dto.type, Array.isArray(dto.outcome) ? dto.outcome.map(x => this.outcomeMapper.from(x)) : this.outcomeMapper.from(dto.outcome), dto.description, dto.assets,dto.data, dto.activities);
    }

}