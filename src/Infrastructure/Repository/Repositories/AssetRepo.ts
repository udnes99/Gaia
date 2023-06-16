import { IAssetRepo } from "../../../Application/Repositories/IAssetRepo";
import { Asset } from "../../../Core/Asset/Asset";
import { OneOrNone } from "../../../Types/OneOrMany";
import { EntityRepository } from "../EntityRepository";

export default class AssetRepo extends EntityRepository<Asset> implements IAssetRepo
{
    public async exists(id: string): Promise<boolean> {
        return this.existsImplicit(id);
    }
    public async find(id: string): Promise<OneOrNone<Asset>> {
        return this.getImplicit(id);
    }
    protected async internalSave(entities: Asset[]): Promise<void> {
        return this.saveImplicit(...entities);
    }
    
}