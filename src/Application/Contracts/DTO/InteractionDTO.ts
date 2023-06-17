import { INTERACTION_STATE } from "../../../Core/Interaction/Interaction"

export interface InteractionDTO
{
    id: string,
    from: string,
    to: string
    state: INTERACTION_STATE,
    activities: Record<string, string[]>,
    transfers: Record<string, string[]>

}