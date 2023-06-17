import { InteractionDTO } from "../../Contracts/DTO/InteractionDTO";
import { InteractionModificationDTO } from "../../Contracts/DTO/InteractionModificationDTO";
import { ICommand } from "../ICommand";

export class ModifyInteractionCommand implements ICommand<void>
{
    constructor
    (
        readonly interaction: InteractionDTO,
        readonly modification: InteractionModificationDTO
    ) {}
}