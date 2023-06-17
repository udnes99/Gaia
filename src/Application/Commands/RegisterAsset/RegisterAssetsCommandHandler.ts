import { Asset } from "../../../Core/Asset/Asset";
import { IContext } from "../../Context/IContext";
import { IAssetRepo } from "../../Repositories/IAssetRepo";
import { ICommandHandler } from "../ICommandHandler";
import { RegisterAssetCommand } from "./RegisterAssetsCommand";

export default class RegisterAssetCommandHandler implements ICommandHandler<RegisterAssetCommand, void>
{
    constructor
    (
        private readonly assetRepo : IAssetRepo,
        private readonly context : IContext
    ) {}
    public async handle(command: RegisterAssetCommand): Promise<void> 
    {
        await Promise.all(command.assets.map(registration => (async () =>
        {

            const composedOf : [Asset, number][] = [];

            if(registration.composedOf)
            {
                await Promise.all(Object.keys(registration.composedOf).map(x => (async () =>
                {
                    const asset = await this.assetRepo.find(x);
                    if(!asset)
                        throw new Error(`Component asset with id ${x} not found`);
                        
                    composedOf.push([asset, registration.composedOf[x]]);
                    ;
                })()));
            }


            const newAsset = Asset.register(registration.id, registration.type, this.context.organization, registration.fractional, registration.activities, registration.data, undefined,...composedOf);
            await this.assetRepo.save(newAsset);
            return newAsset;

        })()));
    }
    
}