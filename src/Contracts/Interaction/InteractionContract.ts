import { Context, Contract } from "fabric-contract-api";
import { Interaction, INTERACTION_STATE } from "../../Core/Interaction/Interaction";
import { InteractionProposal } from "./InteractionProposal";
import { InteractionModification } from "./InteractionModification";
import { createHash} from "crypto";
import { AbstractContract } from "../AbstractContract";
import { AssetContact } from "../Asset/AssetContract";
import { TransferRequest } from "../Asset/TransferRequest";


export class InteractionContract extends AbstractContract
{
    constructor()
    {
        super("Interaction")
        InteractionContract.instance = this;
    }

    private static instance : InteractionContract
    
    public static getInstance() : InteractionContract
    {
        return InteractionContract.instance ?? new InteractionContract();
    }

    private async saveInteraction(ctx: Context, interaction: Interaction)
    {
        const serialized = this.serializer.serializeJSONBuffer(interaction);

        const peerMsp = ctx.stub.getMspID()

        if(![interaction.from, interaction.to].includes(peerMsp))
            throw new Error("Interaction can only be modified by a peer belonging to the interacting parties.");
            
        
        await Promise.all([ctx.stub.putPrivateData(`_implicit_org_${interaction.from}`, `interaction-${interaction.id}`, serialized), ctx.stub.putPrivateData(`_implicit_org_${interaction.to}`, `interaction-${interaction.id}`, serialized)]);
    }

    public async proposeInteraction(ctx: Context, interactionProposal: InteractionProposal)
    {

        const interaction = Interaction.create(interactionProposal.id, ctx.clientIdentity.getMSPID(), interactionProposal.to, interactionProposal.activities, interactionProposal.transfers);

        const [hash1, hash2] = await Promise.all([ctx.stub.getPrivateDataHash(`_implicit_org_${interaction.from}`, `interaction-${interaction.id}`), ctx.stub.getPrivateDataHash(`_implicit_org_${interaction.to}`, `interaction-${interaction.id}`)])

        if(hash1?.length !== 0 || hash2?.length !== 0)
            throw new Error("An interaction with the given ID already exists.");

        await this.saveInteraction(ctx, interaction);
    }

    public async modifyInteraction(ctx: Context, interactionModification: InteractionModification)
    {

        await this.verifyProvidedInteraction(ctx, interactionModification.interaction);
        
        interactionModification.interaction.modify(ctx.clientIdentity.getMSPID(), interactionModification);
        await this.saveInteraction(ctx, interactionModification.interaction);
        
    }

    private async verifyProvidedInteraction(ctx: Context, interaction: Interaction)
    {
        const clientMsp = ctx.clientIdentity.getMSPID();
         if(![interaction.to, interaction.from].includes(ctx.stub.getMspID()))
             throw new Error("The executing peer is not allowed to endorse this.");
        if(![interaction.to, interaction.from].includes(clientMsp))
            throw new Error("The client with msp " + clientMsp + " does not belong to an MSP involved in the provided interaction");
        
        const sha256 = createHash("sha256");
        sha256.update(this.serializer.serializeJSON(interaction));
        const providedInteractionHash = sha256.digest();

        const [hash1, hash2] = await Promise.all([ctx.stub.getPrivateDataHash(`_implicit_org_${interaction.from}`, `interaction-${interaction.id}`), ctx.stub.getPrivateDataHash(`_implicit_org_${interaction.to}`, 
        `interaction-${interaction.id}`)]);

        if(!providedInteractionHash.equals(hash1) || !providedInteractionHash.equals(hash2))
            throw new Error("The provided hash does not match the hash of the current interaction state.");

    }


    public async confirmInteraction(ctx: Context, interaction: Interaction)
    {   
        await this.verifyProvidedInteraction(ctx, interaction);
        if(interaction.completed)
            throw new Error("Interaction has already been completed and cannot be modified.");
        
        const confirmer = ctx.clientIdentity.getMSPID();
        
        if((confirmer === interaction.to && interaction.state === INTERACTION_STATE.RECEIVER_REPROPOSAL) || (confirmer === interaction.from && interaction.state === INTERACTION_STATE.SENDER_REPROPOSAL))
            throw new Error("The interaction cannot be confirmed by the last party that proposed it.")
        interaction.confirm();
        await this.saveInteraction(ctx, interaction);
        if(Object.keys(interaction.transfers).length > 0)
        {
            await Promise.all(Object.keys(interaction.transfers).map(x => (async () =>
            {
                const to = x === interaction.from ? interaction.to : interaction.from;
                await AssetContact.getInstance().transferAsset(ctx, new TransferRequest(to, interaction.transfers[x], x));
            })()));
        }
    }

    public async getIncompleteInteractions(ctx: Context)
    {
        const results = [];

        const iterator = ctx.stub.getPrivateDataByRange(`_implicit_org_${ctx.clientIdentity.getMSPID()}`,'interaction', "interactioo");

        for await (const record of iterator)
        {
            const interaction = this.serializer.deserializeJSON(Interaction, JSON.stringify({...JSON.parse(Buffer.from(record.value).toString("utf-8")), id: record.key}));
            if(!interaction.completed)
                results.push(interaction)
        }
        return JSON.stringify(results.map(x => this.serializer.serializeJSON(x)));
    }

    public async getAllInteractions(ctx: Context)
    {
        const results = [];

        const iterator = ctx.stub.getPrivateDataByRange(`_implicit_org_${ctx.clientIdentity.getMSPID()}`,'interaction', "interactioo");

        for await (const record of iterator)
            results.push(Buffer.from(record.value).toString("utf-8"))

        return JSON.stringify(results)
    }
}