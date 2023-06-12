import { AbstractContract } from "../../Contracts/AbstractContract";
import { IContractManager } from "../../Contracts/IContractManager";
import { Serializer } from "../Mapping/Serializer";

export class ContractManager implements IContractManager
{

    public configure(contract: AbstractContract) 
    {
        contract.setSerializer(Serializer.getInstance())
    }
    
}