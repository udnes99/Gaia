import { AssetDTO } from "../../../Infrastructure/Mapping/Asset/AssetMapper";
import { IAssetRepo } from "../../Repositories/IAssetRepo";
import { ISerializer } from "../../Serializer/ISerializer";
import { IQueryHandler } from "../IQueryHandler";
import { GetAssetsQuery } from "./GetAssetsQuery";

export default class GetAssetsQueryHandler implements IQueryHandler<GetAssetsQuery, AssetDTO[]>
{
    constructor
    (
        private readonly assetRepo : IAssetRepo,
        private readonly serializer : ISerializer
    ) {}
    public async handle(query: GetAssetsQuery): Promise<AssetDTO[]> {
        return <AssetDTO[]>(await this.assetRepo.getAll()).map(x => this.serializer.serialize(x));
    }
    
}