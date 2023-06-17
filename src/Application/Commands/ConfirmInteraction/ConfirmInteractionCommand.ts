import { InteractionDTO } from "../../Contracts/DTO/InteractionDTO";
import { ICommand } from "../ICommand";

export class ConfirmInteractionCommand implements ICommand<void>
{
    constructor
    (
        readonly interaction : InteractionDTO
    ) {}
}