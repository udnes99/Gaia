import { Context, Contract } from "fabric-contract-api";
import { Asset } from "../../Core/Asset/Asset";
import { AssetId } from "../../Core/Asset/AssetId";
import { Consumption } from "../../Core/Asset/Consumption";
import { AbstractContract } from "../AbstractContract";
import { ActivityContract } from "../Activity/ActivityContract";
import { AssetRegistration } from "./AssetRegistration";
import { ConsumptionRegistration } from "./ConsumptionRegistration";
import { Impact } from "./Impact";
import { InvolvementRegistration } from "./InvolvementRegistration";
import { TransferRequest } from "./TransferRequest";



export class AssetContact extends AbstractContract
{
    constructor
    ()
    {
        super("Asset")
        AssetContact.instance = this;
    }

    private static instance : AssetContact


    public static getInstance() : AssetContact
    {
        return AssetContact.instance ?? new AssetContact();
    }


    private async getExistingAsset(ctx: Context, id: string)
    {
        const assetData = await ctx.stub.getPrivateData(`_implicit_org_${ctx.clientIdentity.getMSPID()}`, `asset-${id}`);
        if(!assetData)
            throw new Error(`Asset with id ${id} does not exist.`);
        return this.serializer.deserializeJSONBuffer(Asset, assetData);
    }



    //Obtain owner from ctx. 
    public async registerAsset(ctx: Context, assetRegistration: AssetRegistration)
    {
        const newAssets = await Promise.all(assetRegistration.assets.map(registration => (async () =>
        {

            const composedOf : [Asset, number][] = [];

            if(registration.composedOf)
            {
                await Promise.all(Object.keys(registration.composedOf).map(x => (async () =>
                {
                    const asset = await this.getExistingAsset(ctx, x);
                    composedOf.push([asset, registration.composedOf[x]]);
                    ;
                })()));
            }


            const newAsset = Asset.register(registration.id, registration.type, ctx.clientIdentity.getMSPID(), registration.fractional, registration.activities, registration.data, undefined,...composedOf);
            await this.saveAsset(ctx, newAsset);
            return newAsset;

        })()));
        

        return newAssets.map(x => this.serializer.serializeJSON(x));
        
    }

    private async saveAsset(ctx: Context, asset: Asset)
    {
        await ctx.stub.putPrivateData(`_implicit_org_${asset.owner}`, `asset-${asset.id}`, this.serializer.serializeJSONBuffer(asset));
    }

    public async transferAsset(ctx: Context, transferRequest: TransferRequest, interaction = false)
    {

        await Promise.all(transferRequest.assets.map(x => (async () =>
        {
            const asset = await this.getExistingAsset(ctx, x);
            if(asset.owner !== transferRequest.from)
                throw new Error("Cannot transfer asset because it is owned by a different organization.");
            
            const newOwnerAsset = new Asset(asset.id, asset.type, transferRequest.to, asset.consumption, undefined, undefined, undefined, asset.owner);
            asset.transferTo(transferRequest.to);
            await Promise.all([asset, newOwnerAsset].map(x => this.saveAsset(ctx, x)));

        })));
    }

    public async registerInvolvement(ctx: Context, involvementRegistration : InvolvementRegistration)
    {
        if(!(await ActivityContract.getInstance().exists(ctx, involvementRegistration.activity)))
            throw new Error(`Activity with id ${involvementRegistration.activity} does not exist`);
        await Promise.all(involvementRegistration.assets.map(x => (async () =>
        {
            const asset = await this.getExistingAsset(ctx, x);
            asset.registerActivity((<InvolvementRegistration>involvementRegistration).activity);
        })()));
        
    }

    public async getDownstreamImpact(ctx: Context, assetId: string)
    {
        
        const asset = await this.getExistingAsset(ctx, assetId);
        const impact : Impact = [];
        await Promise.all(asset.activities.map(x => (async () =>
        {
            const activity = await ActivityContract.getInstance().getActivity(ctx, x.activity);
            impact.push({assets: activity.assets, outcome: activity.outcome, activity: activity.id})
        })()));
        return this.serializer.serializeJSON(impact);
    }


    public async consumeAssets(ctx: Context, consumptionRegistration: ConsumptionRegistration)
    {
        if(consumptionRegistration.activity && !(await ActivityContract.getInstance().exists(ctx, consumptionRegistration.activity)))
            throw new Error("Activity does not exist");
        
        await Promise.all(Object.keys(consumptionRegistration.assets).map(x => (async () =>
        {
            const asset = await this.getExistingAsset(ctx, x);
            const consumption = (<ConsumptionRegistration>consumptionRegistration).assets[x];

            if((<ConsumptionRegistration>consumptionRegistration).activity)
                asset.registerActivity((<ConsumptionRegistration>consumptionRegistration).activity, consumption)
            else
                asset.consume(consumption);

            if(consumption === true && asset.composedOf)
            {
                const compositionConsumption : Record<AssetId, Consumption> = {};
                for(const componentAsset in asset.composedOf)
                {
                    compositionConsumption[componentAsset] = true;
                }
                await this.consumeAssets(ctx, new ConsumptionRegistration(compositionConsumption, (<ConsumptionRegistration>consumptionRegistration).activity));

            }
        })()));
    }

    public async getAssets(ctx: Context)
    {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = ctx.stub.getPrivateDataByRange(this.implicitPDCOfClient(ctx),'asset', "asseu");

        for await (const record of iterator)
        {
            const asset = {id: record.key, ...JSON.parse(Buffer.from(record.value).toString("utf-8"))};
            allResults.push(asset)
        }
        return JSON.stringify(allResults);
    }
}