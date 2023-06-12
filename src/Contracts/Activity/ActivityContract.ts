import { Context } from "fabric-contract-api";
import { Activity } from "../../Core/Activity/Activity";
import { ActivityId } from "../../Core/Activity/ActivityId";
import { ActivityRecord } from "../../Core/Asset/ActivityRecord";
import { Outcome } from "../../Core/Outcome/Outcome";
import { OneOrMany } from "../../Types/OneOrMany";
import { AbstractContract } from "../AbstractContract";
import { AssetContact } from "../Asset/AssetContract";
import { AssetRegistration } from "../Asset/AssetRegistration";
import { ConsumptionRegistration } from "../Asset/ConsumptionRegistration";
import { InvolvementRegistration } from "../Asset/InvolvementRegistration";
import { ActivityRegistration } from "./ActivityRegistration";

export class ActivityContract extends AbstractContract
{
    constructor
    ()
    {
        super("Activity")
        ActivityContract.instance = this;
    }

    private static instance : ActivityContract

    private readonly newActivities : Map<string, Map<ActivityId,Activity>> = new Map();


    public static getInstance() : ActivityContract
    {
        return ActivityContract.instance ?? new ActivityContract();
    }

    public async beforeTransaction(ctx: Context): Promise<void> 
    {
        this.newActivities.set(ctx.stub.getTxID(), new Map());
    }

    public async afterTransaction(ctx: Context): Promise<void> 
    {
        this.newActivities.delete(ctx.stub.getTxID());
    }
    
    private async saveActivity(ctx: Context, activity: Activity)
    {
        await Promise.all([ctx.stub.putPrivateData(`_implicit_org_${ctx.clientIdentity.getMSPID()}`, `activity-${activity.id}`, this.serializer.serializeJSONBuffer(activity)), ctx.stub.putState(`activity-${activity.id}`, this.serializer.serializeJSONBuffer(activity.outcome))]);

    }

    public async registerActivity(ctx: Context, activityRegistration: ActivityRegistration)
    {

        if(await this.exists(ctx, activityRegistration.id))
            throw new Error("An activity with the provided id already exists.")

        if(activityRegistration.activities && !((await Promise.all(activityRegistration.activities.map(x => this.exists(ctx, x)))).every(x => x)))
            throw new Error("Unknown activity specified");
        

        let assetCount = 0;

        if(activityRegistration.assets)
        {
            if(activityRegistration.assets.produced)
            {
                await AssetContact.getInstance().registerAsset(ctx, new AssetRegistration(activityRegistration.assets.produced.map(x => ({id: x.id, type: x.type, fractional: x.fractional, composedOf: x.composedOf, activities: [new ActivityRecord((<ActivityRegistration>activityRegistration).id, true)]}))));
                assetCount += activityRegistration.assets.produced.length;
            }
                
            if(activityRegistration.assets.consumed)
            {
                await AssetContact.getInstance().consumeAssets(ctx, new ConsumptionRegistration(activityRegistration.assets.consumed, activityRegistration.id));
                assetCount += Object.keys(activityRegistration.assets.consumed).length;
            }
                
            if(activityRegistration.assets.involved)
            {
                await AssetContact.getInstance().registerInvolvement(ctx, new InvolvementRegistration(activityRegistration.assets.involved, activityRegistration.id));
                assetCount += activityRegistration.assets.involved.length;
            }
                
        }
        const newActivity = Activity.registerNew(activityRegistration.id, activityRegistration.type, activityRegistration.outcome, activityRegistration.description, assetCount,activityRegistration.data, activityRegistration.activities);
        await this.saveActivity(ctx, newActivity);
        return {activity: this.serializer.serializeJSON(newActivity)};
    }


    public async getActivity(ctx: Context, id: ActivityId)
    {
        const data = await ctx.stub.getPrivateData(`_implicit_org_${ctx.clientIdentity.getMSPID()}`, `activity-${id}`);
        if(data?.length === 0)
            throw new Error("Activity with id " + id + " does not exist");
        return this.serializer.deserializeJSONBuffer(Activity, data);
    }

    public async getActivityOutcome(ctx: Context, id: ActivityId) : Promise<OneOrMany<Outcome>>
    {
        const data = await ctx.stub.getState(`activity-${id}`);
        if(data?.length === 0)
            throw new Error("Activity with id " + id + " does not exist");
        return JSON.parse(Buffer.from(data).toString("utf-8"));
    }


    public async getActivities(ctx: Context)
    {
        const allResults = [];
        const iterator = ctx.stub.getPrivateDataByRange(`_implicit_org_${ctx.clientIdentity.getMSPID()}`,'activity', "activitz");

        for await (const record of iterator)
        {
            const asset = {id: record.key, ...JSON.parse(Buffer.from(record.value).toString("utf-8"))};
            allResults.push(asset)
        }
        return allResults;
    }

    public async exists(ctx: Context, id: string) : Promise<boolean>
    {
        return this.newActivities.get(ctx.stub.getTxID()).has(id) || (await ctx.stub.getState(`activity-${id}`))?.length != 0
    }


}