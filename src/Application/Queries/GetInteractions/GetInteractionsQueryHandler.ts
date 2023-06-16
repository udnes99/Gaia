import { ISerializer } from "../../Serializer/ISerializer";
import { InteractionDTO } from "../../Contracts/DTO/InteractionDTO";
import { IInteractionRepo } from "../../Repositories/IInteractionRepo";
import { IQueryHandler } from "../IQueryHandler";
import { GetInteractionsQuery } from "./GetInteractionsQuery";

export default class GetInteractionsQueryHandler implements IQueryHandler<GetInteractionsQuery, InteractionDTO[]>
{
    constructor
    (
        private readonly interactionRepo : IInteractionRepo,
        private readonly serializer : ISerializer
    ) {} 
    public async handle(query: GetInteractionsQuery): Promise<InteractionDTO[]> 
    {
        const interactions = await this.interactionRepo.getAll();
        return <InteractionDTO[]>interactions.map(x => this.serializer.serialize(x));
    }
    
}