import { IMapper } from "../../../../Application/Mapping/IMapper";
import { GreenhouseGasEmitted, GREEN_HOUSE_GAS_TYPE, GREEN_HOUSE_GAS_UNIT } from "../../../../Core/Outcome/GHG/GreenhouseGasEmitted";
import { OutcomeDTO } from "../OutcomeMapper";

export interface GreenhouseGasEmittedDTO extends OutcomeDTO
{
    gas_type: GREEN_HOUSE_GAS_TYPE,
    unit: GREEN_HOUSE_GAS_UNIT,
    magnitude: number
}

export default class GreenhouseGasEmittedMapper implements IMapper<GreenhouseGasEmitted, GreenhouseGasEmittedDTO>
{
    public to(obj: GreenhouseGasEmitted): GreenhouseGasEmittedDTO 
    {
        return {
            gas_type: obj.type,
            unit: obj.unit, 
            magnitude: obj.magnitude,
            type: GreenhouseGasEmitted.name
        }
    }
    public from(dto: GreenhouseGasEmittedDTO): GreenhouseGasEmitted 
    {
        return new GreenhouseGasEmitted(dto.gas_type, dto.unit, dto.magnitude);
    }

}