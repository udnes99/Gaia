import { Activity } from "../../Core/Activity/Activity";
import { ActivityId } from "../../Core/Activity/ActivityId";
import { OneOrNone } from "../../Types/OneOrMany";
import { IRepo } from "./IRepo";

export interface IActivityRepo extends IRepo<Activity>
{
    find(id: ActivityId) : Promise<OneOrNone<Activity>>
    getAll() : Promise<Activity[]>
    exists(id: string) : Promise<boolean>
}