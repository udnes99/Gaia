import { Activity } from "../../../Core/Activity/Activity";
import { ActivityId } from "../../../Core/Activity/ActivityId";
import { Asset } from "../../../Core/Asset/Asset";
import { AssetId } from "../../../Core/Asset/AssetId";
import { Consumption } from "../../../Core/Asset/Consumption";
import { IContext } from "../../Context/IContext";
import { IActivityRepo } from "../../Repositories/IActivityRepo";
import { IAssetRepo } from "../../Repositories/IAssetRepo";
import { ISerializer } from "../../Serializer/ISerializer";
import { ICommandHandler } from "../ICommandHandler";
import { RegisterActivityCommand } from "./RegisterActivityCommand";


export default class RegisterActivityCommandHandler implements ICommandHandler<RegisterActivityCommand, void>
{
    constructor
    (
        private readonly activityRepo : IActivityRepo,
        private readonly assetRepo : IAssetRepo,
        private readonly context : IContext,
        private readonly serializer : ISerializer
    ) {}

  
    public async handle(command: RegisterActivityCommand): Promise<void> 
    {
        const exists = await this.activityRepo.exists(command.id);
        if(exists)
            throw new Error("An activity with the same id already exists");

        let assetCount = 0;

        if(command.assets)
        {
            if(command.assets.produced)
            {
                await this.registerProduced(command.id, command.assets.produced);
                assetCount += command.assets.produced.length;
            }
                
            if(command.assets.consumed)
            {
                await this.registerConsumption(command.id, command.assets.consumed);
                assetCount += Object.keys(command.assets.consumed).length;
            }
                
            if(command.assets.involved)
            {
                await this.registerInvolvement(command.id, command.assets.involved);
                assetCount += command.assets.involved.length;
            }
                
        }
        const newActivity = Activity.registerNew(command.id, command.type, Array.isArray(command.outcome) ? command.outcome.map(x => this.serializer.deserialize(x.type, x)) : this.serializer.deserialize(command.outcome.type, command.outcome) , command.description, assetCount, command.data);
        
        await this.activityRepo.save(newActivity);
    }

    private async registerProduced(activity: ActivityId, assets:  {id: string,type: string, fractional: boolean, composedOf?: Record<string, number>}[])
    {
        await Promise.all(assets.map(details => (async () =>
        {
            const composedOf : [Asset, number][] = [];

            if(details.composedOf)
            {
                await Promise.all(Object.keys(details.composedOf).map(x => (async () =>
                {
                    const asset = await this.assetRepo.find(x);
                    if(!asset)
                        throw new Error(`Component asse with id ${x} not found`);
                    composedOf.push([asset, details.composedOf[x]]);
                    ;
                })()));
            }
            const newAsset = Asset.register(details.id, details.type, this.context.organization, details.fractional, [{activity, production: true}], undefined, undefined,...composedOf);
            await this.assetRepo.save(newAsset);
        })()));
    } 

    private async registerInvolvement(activity: ActivityId, assets: AssetId[])
    {
        await Promise.all(assets.map(x => (async () => 
        {
            const asset = await this.assetRepo.find(x);
            asset.registerActivity(activity);
            await this.assetRepo.save(asset);
        })()));
    }
    private async registerConsumption(activity: ActivityId, assets: Record<AssetId, Consumption>)
    {
        await Promise.all(Object.keys(assets).map(x => (async () =>
        {
            const asset = await this.assetRepo.find(x);
            if(!asset)
                throw Error(`Asset with id ${x} not found.`);
            asset.registerActivity(activity, asset[x]);
            asset.consume(assets[x]);
            await this.assetRepo.save(asset);
        })()))
    }
}