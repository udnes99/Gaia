import { OrganizationId } from "../../Organization/OrganizationId";
import { Outcome } from "../Outcome";

export enum ELECTRICITY_PRODUCTION_UNIT
{
    
}
export class ElectricityProduced extends Outcome
{
    constructor
    (
        readonly magnitude: number,
        readonly unit: ELECTRICITY_PRODUCTION_UNIT,
    ) {super()}
}