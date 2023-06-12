import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { AssetId } from "../../../Core/Asset/AssetId";
import { INTERACTION_STATE, Interaction } from "../../../Core/Interaction/Interaction";

export interface InteractionDTO
{
    id: string,
    from: string,
    to: string
    state: INTERACTION_STATE,
    activities: Record<string, string[]>,
    transfers: Record<string, string[]>

}
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