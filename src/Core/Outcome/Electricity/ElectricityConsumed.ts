import { OrganizationId } from "../../Organization/OrganizationId";
import { Outcome } from "../Outcome";

export enum ELECTRICITY_CONSUMPTION_UNIT
{
    
}
export class ElectricityConsumed extends Outcome
{
    constructor
    (
        readonly magnitude: number,
        readonly unit: ELECTRICITY_CONSUMPTION_UNIT,
    ) {super()}
}