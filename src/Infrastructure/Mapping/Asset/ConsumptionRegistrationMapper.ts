import { ConsumptionRegistration } from "../../../Contracts/Asset/ConsumptionRegistration";
import { IMapper } from "../../../Contracts/Mapper/IMapper";
import { AssetId } from "../../../Core/Asset/AssetId";
import { Consumption } from "../../../Core/Asset/Consumption";


export interface ConsumptionRegistrationDTO
{
    assets: Record<AssetId, Consumption>   
} {}
export default class ConsumptionRegistrationMapper implements IMapper<ConsumptionRegistration, ConsumptionRegistrationDTO>
{
    public to(obj: ConsumptionRegistration): ConsumptionRegistrationDTO 
    {
        return {
            assets: obj.assets
        }
    }
    public from(dto: ConsumptionRegistrationDTO): ConsumptionRegistration 
    {
        return new ConsumptionRegistration(dto.assets);
    }
    
}