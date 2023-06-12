import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { ActivityId } from "../../../Core/Activity/ActivityId";
import { ActivityRecord } from "../../../Core/Asset/ActivityRecord";
import { Consumption } from "../../../Core/Asset/Consumption";

export interface ActivityRecordDTO
{
    activity: ActivityId,
    production?: boolean,
    consumption?: Consumption
}
export default class AcitivtyRecordMapper implements IMapper<ActivityRecord, ActivityRecordDTO>
{
    public to(obj: ActivityRecord): ActivityRecordDTO 
    {
        return {
            activity: obj.activity,
            production: obj.production,
            consumption: obj.consumption
        }
    }
    public from(dto: ActivityRecordDTO): ActivityRecord 
    {
        return new ActivityRecord(dto.activity, dto.production, dto.consumption);
    }

}