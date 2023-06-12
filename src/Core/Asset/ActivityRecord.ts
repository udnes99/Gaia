import { ActivityId } from "../Activity/ActivityId";
import { Consumption } from "./Consumption";

export class ActivityRecord
{
    constructor
    (
        readonly activity: ActivityId,
        readonly production?: boolean,
        readonly consumption?: Consumption
    ) {}
}