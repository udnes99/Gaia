import { ISerializer } from "../../Serializer/ISerializer";
import { ActivityDTO } from "../../Contracts/DTO/ActivityDTO";
import { IActivityRepo } from "../../Repositories/IActivityRepo";
import { IQueryHandler } from "../IQueryHandler";
import { GetActivitiesQuery } from "./GetActivitiesQuery";

export default class GetActivitiesQueryHandler implements IQueryHandler<GetActivitiesQuery, ActivityDTO[]>
{
    constructor
    (
        private readonly activityRepo : IActivityRepo,
        private readonly serializer : ISerializer
    ) {}
    public async handle(query: GetActivitiesQuery): Promise<ActivityDTO[]> 
    {
        const activities = await this.activityRepo.getAll();
        return <ActivityDTO[]>activities.map(x => this.serializer.serialize(x))
    }
    
}