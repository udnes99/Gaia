import { AbstractContract } from "./AbstractContract";

export interface IContractManager
{
    configure(contract: AbstractContract) : void
}