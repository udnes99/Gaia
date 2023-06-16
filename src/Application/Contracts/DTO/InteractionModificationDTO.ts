import { InteractionDTO } from "./InteractionDTO";

export interface InteractionModificationDTO
{
    interaction: InteractionDTO,
    activities?: {remove?: string[], register?: string[]}
}