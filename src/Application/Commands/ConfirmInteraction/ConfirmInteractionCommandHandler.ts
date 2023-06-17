import { ISerializer } from "../../Serializer/ISerializer";
import { Interaction } from "../../../Core/Interaction/Interaction";
import { IContext } from "../../Context/IContext";
import { IInteractionRepo } from "../../Repositories/IInteractionRepo";
import { ICommandHandler } from "../ICommandHandler";
import { ConfirmInteractionCommand } from "./ConfirmInteractionCommand";

export default class ConfirmInteractionCommandHandler implements ICommandHandler<ConfirmInteractionCommand, void>
{
    constructor
    (
        private readonly interactionRepo : IInteractionRepo,
        private readonly context : IContext,
        private readonly serializer : ISerializer
    ) {}
    public async handle(command: ConfirmInteractionCommand): Promise<void> 
    {
        const interaction = this.serializer.deserialize(Interaction, command.interaction);
        if(![interaction.to, interaction.from].includes(this.context.organization))
            throw new Error("Interaction can only be confirmed by an organization involved.")
        if(!await this.interactionRepo.equalsCurrentVersion(interaction))
            throw new Error("The provided interaction does not match the current version.");
        interaction.confirm(this.context.organization);
        await this.interactionRepo.save(interaction);
        
    }
    
}