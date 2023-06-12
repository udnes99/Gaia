import { DTO, IMapper } from "../../../Contracts/Mapper/IMapper";
import { ActivityId } from "../../../Core/Activity/ActivityId";
import { ActivityRecord } from "../../../Core/Asset/ActivityRecord";
import { Asset } from "../../../Core/Asset/Asset";
import { Consumption } from "../../../Core/Asset/Consumption";
import { PrimitiveObject } from "../../../Types/PrimitiveField";
import { ActivityRecordDTO } from "./ActivityRecordMapper";


export interface AssetDTO extends DTO<Asset>
{
    id: string,
    type: string,
    description?: string,
    activities?: ActivityRecordDTO[]
    data?: PrimitiveObject,
    consumption: Consumption,
    composedOf?: Record<ActivityId, number>
    owner: string
}
export default class AssetMapper implements IMapper<Asset, AssetDTO>
{
    constructor
    (
        private readonly activityRecordMapper : IMapper<ActivityRecord, ActivityRecordDTO>
    ) {}
    public to(obj: Asset): AssetDTO {
        return {
            id: obj.id,
            type: obj.type,
            activities: obj.activities?.map(x => this.activityRecordMapper.to(x)),
            data: obj.data,
            owner: obj.previousOwner,
            consumption: obj.consumption
        }
    }
    public from(dto: AssetDTO): Asset {
        return new Asset(dto.id, dto.type, dto.owner, dto.consumption, dto.activities?.map(x => this.activityRecordMapper.from(x)), dto.data, dto.composedOf);
    }

}