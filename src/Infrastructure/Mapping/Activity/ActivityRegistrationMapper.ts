import { ActivityRegistration } from "../../../Contracts/Activity/ActivityRegistration";
import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { Consumption } from "../../../Core/Asset/Consumption";
import { Outcome } from "../../../Core/Outcome/Outcome";
import { OneOrMany } from "../../../Types/OneOrMany";
import { PrimitiveField } from "../../../Types/PrimitiveField";
import { OutcomeDTO } from "../Outcome/OutcomeMapper";

export interface ActivityRegistrationDTO
{
    id: string,
    type: string,
    outcome: OneOrMany<OutcomeDTO>,
    assets?: 
    {
        produced?:
        {
            id: string,
            type: string,
            fractional: boolean,
            composedOf?: Record<string, number>,
        }[],
        consumed?: Record<string, Consumption>
    },
    description?: string,
    data?: Record<string, PrimitiveField>,
    activities?: string[]
}
export default class ActivityRegistrationMapper implements IMapper<ActivityRegistration, ActivityRegistrationDTO>
{
    constructor
    (
        private readonly outcomeMapper : IMapper<Outcome, OutcomeDTO>
    ) {}
    public to(obj: ActivityRegistration): ActivityRegistrationDTO 
    {
        return {
            id: obj.id,
            type: obj.type,
            activities: obj.activities,
            assets: obj.assets,
            data: obj.data,
            description: obj.description,
            outcome: Array.isArray(obj.outcome) ? obj.outcome.map(x => this.outcomeMapper.to(x)) : this.outcomeMapper.to(obj.outcome)

            
        }
    }
    public from(dto: ActivityRegistrationDTO): ActivityRegistration {
        return new ActivityRegistration(dto.id,dto.type, Array.isArray(dto.outcome) ? dto.outcome.map(x => this.outcomeMapper.from(x)) : this.outcomeMapper.from(dto.outcome), dto.assets, dto.description, dto.data, dto.activities); 
    }
    
}