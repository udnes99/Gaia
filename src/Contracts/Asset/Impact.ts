import { ActivityId } from "../../Core/Activity/ActivityId";
import { Outcome } from "../../Core/Outcome/Outcome";
import { OneOrMany } from "../../Types/OneOrMany";

export type Impact = {outcome: OneOrMany<Outcome>, activity: ActivityId, assets: number}[]
