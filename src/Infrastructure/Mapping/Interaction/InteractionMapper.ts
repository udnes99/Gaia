import { InteractionDTO } from "../../../Application/Contracts/DTO/InteractionDTO";
import { IMapper } from "../../../Application/Mapping/IMapper";
import { Interaction } from "../../../Core/Interaction/Interaction";


export default class InteractionMapper implements IMapper<Interaction, InteractionDTO>
{
    constructor
    (
    ) {}
    public to(obj: Interaction): InteractionDTO 
    {
        return {
            id: obj.id,
            activities: obj.activities,
            transfers: obj.transfers,
            from: obj.from,
            to: obj.to,
            state: obj.state
        }
    }
    public from(dto: InteractionDTO): Interaction 
    {
        return new Interaction(dto.id, dto.from, dto.to, dto.activities, dto.transfers,dto.state);
    }

}