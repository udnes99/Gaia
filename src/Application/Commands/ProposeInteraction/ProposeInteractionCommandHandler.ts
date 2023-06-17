import { Interaction } from "../../../Core/Interaction/Interaction";
import { IContext } from "../../Context/IContext";
import { IInteractionRepo } from "../../Repositories/IInteractionRepo";
import { ICommandHandler } from "../ICommandHandler";
import { ProposeInteractionCommand } from "./ProposeInteractionCommand";

export default class ProposeInteractionCommandHandler implements ICommandHandler<ProposeInteractionCommand, void>
{
    constructor
    (
        private readonly interactionRepo : IInteractionRepo,
        private readonly context : IContext
    ) {}
    public async handle(command: ProposeInteractionCommand): Promise<void> 
    {
        if(await this.interactionRepo.exists(command.id, command.to, this.context.organization))
            throw new Error(`An interaction with id ${command.id} already exists.`);
        const newInteraction = Interaction.create(command.id, this.context.organization, command.to, command.activities, command.transfers);
        await this.interactionRepo.save(newInteraction);
    }
    
}