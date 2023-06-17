import { Asset } from "../../Core/Asset/Asset";
import { IRepo } from "./IRepo";

export interface IAssetRepo extends IRepo<Asset>
{
    exists(id: string) : Promise<boolean>
    getAll() : Promise<Asset[]>
}