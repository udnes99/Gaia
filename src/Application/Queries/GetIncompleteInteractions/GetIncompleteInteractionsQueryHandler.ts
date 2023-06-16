import { ISerializer } from "../../Serializer/ISerializer";
import { InteractionDTO } from "../../Contracts/DTO/InteractionDTO";
import { IInteractionRepo } from "../../Repositories/IInteractionRepo";
import { IQueryHandler } from "../IQueryHandler";
import { GetIncompleteInteractionsQuery } from "./GetIncompleteInteractionsQuery";

export default class GetIncompleteInteractionsQueryHandler implements IQueryHandler<GetIncompleteInteractionsQuery, InteractionDTO[]>
{
    constructor
    (
        private readonly interactionRepo : IInteractionRepo,
        private readonly serializer : ISerializer
    ) {}
    public async handle(query: GetIncompleteInteractionsQuery): Promise<InteractionDTO[]> 
    {
        const incompleteInteractions = await this.interactionRepo.getIncomplete();
        return <InteractionDTO[]>incompleteInteractions.map(x => this.serializer.serialize(x));
    }
    
}