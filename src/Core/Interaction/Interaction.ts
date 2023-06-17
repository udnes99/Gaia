import { InteractionModification } from "../../Application/Commands/ModifyInteraction/InteractionModification";
import { ActivityId } from "../Activity/ActivityId";
import { AssetId } from "../Asset/AssetId";
import { OrganizationId } from "../Organization/OrganizationId";


export enum INTERACTION_STATE
{
    CANCELLED = -1,
    PROPOSED = 0,
    RECEIVER_REPROPOSAL = 1,
    SENDER_REPROPOSAL = 2,
    DECLINED = 3,
    CONFIRMED = 4
}
export class Interaction
{


    public get state () : INTERACTION_STATE
    {
        return this._state;
    }
    constructor
    (
        public readonly id: string,
        public readonly from: OrganizationId,
        public readonly to: OrganizationId,
        public readonly activities : Record<OrganizationId, ActivityId[]> = {},
        public readonly transfers : Record<OrganizationId, AssetId[]> ={},
        private _state : INTERACTION_STATE
        
    ) {}

    private ensureNotCompleted()
    {
        if(this.completed)
            throw new Error("Interaction has already been finalized.");
    }

    public get completed()
    {
        return [INTERACTION_STATE.CONFIRMED, INTERACTION_STATE.DECLINED, INTERACTION_STATE.CANCELLED].includes(this._state)
    }

    private ensurePartOfInteraction(actor: OrganizationId)
    {

    }

    public confirm(confirmedBy : OrganizationId)
    {
        this.ensurePartOfInteraction(confirmedBy);
        this.ensureNotCompleted();

        if((confirmedBy === this.from && this._state !== INTERACTION_STATE.RECEIVER_REPROPOSAL) || (confirmedBy === this.to && ![INTERACTION_STATE.PROPOSED, INTERACTION_STATE.SENDER_REPROPOSAL].includes(this._state)))
            throw new Error("Interaction cannot be confirmed by the last party that proposed or modified it.");
        
            
        this._state = INTERACTION_STATE.CONFIRMED;
    }

    public decline(declinedBy: OrganizationId)
    {
        this.ensurePartOfInteraction(declinedBy);
        this.ensureNotCompleted();
        if((declinedBy === this.from && this._state !== INTERACTION_STATE.RECEIVER_REPROPOSAL) || (declinedBy === this.to && ![INTERACTION_STATE.PROPOSED, INTERACTION_STATE.SENDER_REPROPOSAL].includes(this._state)))
            throw new Error("Interaction cannot be declined by the last party that proposed or modified it.");
        this._state = INTERACTION_STATE.DECLINED;
    }

    public cancel(cancelledBy : OrganizationId)
    {
        this.ensurePartOfInteraction(cancelledBy);
        this.ensureNotCompleted();
        if((cancelledBy === this.from && ![INTERACTION_STATE.SENDER_REPROPOSAL, INTERACTION_STATE.PROPOSED].includes(this._state)) || (cancelledBy === this.to && this._state !== INTERACTION_STATE.RECEIVER_REPROPOSAL))
            throw new Error("Interaction cannot be declined by the last party that proposed or modified it.");
        this._state = INTERACTION_STATE.CANCELLED;
    }

    public static create(id: string, from: OrganizationId, to: OrganizationId, activities: Record<OrganizationId, ActivityId[]>, transfers: Record<OrganizationId, AssetId[]>)
    {
        return new Interaction(id, from, to, activities, transfers,INTERACTION_STATE.PROPOSED);
    }

    private removeActivity(organization: OrganizationId, id: ActivityId)
    {
        const index = this.activities[organization].findIndex(x => x === id);
        if(index === -1)
            return;
        this.activities[organization].splice(index, 1);
    }


    private registerActivity(organization: OrganizationId, id: ActivityId)
    {
        const index = this.activities[organization].findIndex(x => x === id);
        if(index !== -1)
            throw new Error("Activity with the provided id already exists in this interaction.");
        else
            this.activities[organization].push(id);
    }

    public modify(modifier: OrganizationId, modification: InteractionModification)
    {
        this.ensureNotCompleted();
        if(![this.from, this.to].includes(modifier))
            throw new Error("Unknown modifier; has to be either recipient or sender of the interaction");
        if(modification.activities)
        {
            modification.activities.register?.forEach(x => this.registerActivity(modifier,x));
            modification.activities.remove?.forEach(x => this.removeActivity(modifier, x));
        }
        this._state = modifier === this.from ? INTERACTION_STATE.SENDER_REPROPOSAL : INTERACTION_STATE.RECEIVER_REPROPOSAL;
            
        
    }



    
}