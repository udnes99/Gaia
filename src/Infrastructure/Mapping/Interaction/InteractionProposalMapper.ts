import { ActivityRegistration } from "../../../Contracts/Activity/ActivityRegistration";
import { InteractionProposal } from "../../../Contracts/Interaction/InteractionProposal";
import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { ActivityRegistrationDTO } from "../Activity/ActivityRegistrationMapper";


export interface InteractionProposalDTO
{
    id: string,
    to: string,
    activities: Record<string, string[]>,
    transfers: Record<string, string[]>,
    from?: string,

}
export default class InteractionProposalMapper implements IMapper<InteractionProposal, InteractionProposalDTO>
{

    constructor
    (
        private readonly activityRegistrationMapper: IMapper<ActivityRegistration, ActivityRegistrationDTO>
    ) {}
    public to(obj: InteractionProposal): InteractionProposalDTO 
    {
        return {
            id: obj.id,
            to: obj.to,
            from: obj.from,
            activities: obj.activities,
            transfers: obj.transfers
        }
    }
    public from(dto: InteractionProposalDTO): InteractionProposal 
    {
        return new InteractionProposal(dto.id, dto.to, dto.activities, dto.transfers,dto.from);
    }
    
}