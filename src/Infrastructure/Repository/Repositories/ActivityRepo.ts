import { IActivityRepo } from "../../../Application/Repositories/IActivityRepo";
import { Activity } from "../../../Core/Activity/Activity";
import { OneOrNone } from "../../../Types/OneOrMany";
import { EntityRepository } from "../EntityRepository";

export default class ActivityRepo extends EntityRepository<Activity> implements IActivityRepo
{
    public async getAll(): Promise<Activity[]> 
    {
        return await this.getAllImplicit()
    }

    protected internalSave(entities: Activity[]): Promise<void> 
    {
        return this.saveImplicit(...entities);
    }
    public find(id: string): Promise<OneOrNone<Activity>> {
        return this.getImplicit(id)
    }

    public async exists(id: string) : Promise<boolean>
    {
        return this.existsImplicit(id);
    }
    
    
}