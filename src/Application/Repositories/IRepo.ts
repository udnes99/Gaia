import { Entity } from "../../Core/Entity"
import { OneOrNone } from "../../Types/OneOrMany"

export interface IRepo<TEntity extends Entity>
{
    find(id: string) : Promise<OneOrNone<TEntity>>
    save(...entities: TEntity[]) : Promise<void>
}