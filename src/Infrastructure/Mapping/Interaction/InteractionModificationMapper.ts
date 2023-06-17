import { InteractionDTO } from "../../../Application/Contracts/DTO/InteractionDTO";
import { InteractionModificationDTO } from "../../../Application/Contracts/DTO/InteractionModificationDTO";
import { InteractionModification } from "../../../Application/Commands/ModifyInteraction/InteractionModification";
import { Interaction } from "../../../Core/Interaction/Interaction";
import { IMapper } from "../../../Application/Mapping/IMapper";



export default class InteractionModificationMapper implements IMapper<InteractionModification, InteractionModificationDTO>
{
    constructor
    (
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