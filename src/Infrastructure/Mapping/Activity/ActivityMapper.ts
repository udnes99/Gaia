import { ActivityDTO } from "../../../Application/Contracts/DTO/ActivityDTO";
import { IMapper } from "../../../Application/Mapping/IMapper";
import { Activity } from "../../../Core/Activity/Activity";
import { Outcome } from "../../../Core/Outcome/Outcome";
import { OutcomeDTO } from "../Outcome/OutcomeMapper";


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