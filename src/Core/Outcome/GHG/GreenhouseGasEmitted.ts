import { Outcome } from "../Outcome";

export enum GREEN_HOUSE_GAS_TYPE
{
    CARBON_DIOXIDE = 0,
    METHANE = 1,
    NITROUS_OXIDE= 2,
    SULFUR_HEXA_FLUORIDE = 3,

    

}

export enum GREEN_HOUSE_GAS_UNIT
{
    METRIC_TON,
    KILOGRAM
    
}
export class GreenhouseGasEmitted extends Outcome
{
    constructor(readonly type: GREEN_HOUSE_GAS_TYPE, readonly unit: GREEN_HOUSE_GAS_UNIT, readonly magnitude: number) {super()}
}