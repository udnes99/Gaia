import { Interaction } from "../../Core/Interaction/Interaction";
import { InteractionId } from "../../Core/Interaction/InteractionId";
import { IRepo } from "./IRepo";

export interface IInteractionRepo extends IRepo<Interaction>
{
    find(id: InteractionId) : Promise<Interaction>
    getIncomplete() : Promise<Interaction[]>
    getAll() : Promise<Interaction[]>
    exists(id: string, to: string, from: string) : Promise<boolean>
    equalsCurrentVersion(interaction: Interaction) : Promise<boolean>

}