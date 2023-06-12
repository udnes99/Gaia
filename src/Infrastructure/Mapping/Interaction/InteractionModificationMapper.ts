import { ActivityRegistration } from "../../../Contracts/Activity/ActivityRegistration";
import { InteractionModification } from "../../../Contracts/Interaction/InteractionModification";
import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { Interaction } from "../../../Core/Interaction/Interaction";
import { ActivityRegistrationDTO } from "../Activity/ActivityRegistrationMapper";
import { InteractionDTO } from "./InteractionMapper";


export interface InteractionModificationDTO
{
    interaction: InteractionDTO,
    activities?: {remove?: string[], register?: string[]}
}
export default class InteractionModificationMapper implements IMapper<InteractionModification, InteractionModificationDTO>
{
    constructor
    (
        private readonly activityRegistrationMapper: IMapper<ActivityRegistration, ActivityRegistrationDTO>,
        private readonly interactionMapper: IMapper<Interaction, InteractionDTO>
    ) {}
    public to(obj: InteractionModification): InteractionModificationDTO 
    {
        return {

            interaction: this.interactionMapper.to(obj.interaction),
            activities: obj.activities ? {remove: obj.activities.remove, register: obj.activities.register} : undefined
        }
    }
    public from(dto: InteractionModificationDTO): InteractionModification 
    {
        return new InteractionModification(this.interactionMapper.from(dto.interaction), dto.activities ? {remove: dto.activities.remove, register: dto.activities.register} : undefined);
    }
    
}