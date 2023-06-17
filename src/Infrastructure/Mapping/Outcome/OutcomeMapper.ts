import { Outcome } from "../../../Core/Outcome/Outcome";
import { AwilixContainer } from "awilix";
import { container } from "../../../index"
import { DTO, IMapper } from "../../../Application/Mapping/IMapper";

export interface OutcomeDTO extends DTO<Outcome>
{
    type: string
}


export default class OutcomeMapper implements IMapper<Outcome, OutcomeDTO>
{
    constructor
    (
        private readonly container : AwilixContainer
    ) {}
    public to(obj: Outcome): OutcomeDTO {
        const type = obj.constructor.name;
        const mapper = type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper";
        if(!this.container.hasRegistration(mapper))
            throw new Error("Missing mapper for Outcome of type " + type);
        return this.container.resolve<IMapper<Outcome, OutcomeDTO>>(mapper).to(obj);
    }
    public from(dto: OutcomeDTO): Outcome 
    {
        const type = dto.type
        const mapper = type.substring(0, 1).toLowerCase() + type.substring(1) + "Mapper";
        if(!this.container.hasRegistration(mapper))
            throw new Error("Missing mapper for outcome of type " + type);
        return this.container.resolve<IMapper<Outcome, OutcomeDTO>>(mapper).from(dto);
    }

    public static getInstance() : OutcomeMapper
    {
        return container.resolve("outcomeMapper")
    }
    
}