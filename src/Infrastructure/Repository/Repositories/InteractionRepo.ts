import { IInteractionRepo } from "../../../Application/Repositories/IInteractionRepo";
import { Interaction, } from "../../../Core/Interaction/Interaction";
import { EntityRepository } from "../EntityRepository";
import { createHash } from "crypto"
import { OrganizationId } from "../../../Core/Organization/OrganizationId";
export default class InterationRepo extends EntityRepository<Interaction> implements IInteractionRepo
{
    public async equalsCurrentVersion(interaction: Interaction): Promise<boolean> 
    {       
       const sha256 = createHash("sha256");
       sha256.update(this.serializer.serializeJSON(interaction));
       const providedInteractionHash = sha256.digest();

       const [hash1, hash2] = await Promise.all([this.ctx.stub.getPrivateDataHash(`_implicit_org_${interaction.from}`, interaction.id), this.ctx.stub.getPrivateDataHash(this.getImplicitPrivateDataCollection(interaction.to), interaction.id)]);

       if(!providedInteractionHash.equals(hash1) || !providedInteractionHash.equals(hash2))
            return false
        return true;
    }
    public async exists(id: string, to : OrganizationId, from: OrganizationId): Promise<boolean> 
    {
        const [hash1, hash2] = await Promise.all([this.ctx.stub.getPrivateDataHash(this.getImplicitPrivateDataCollection(to), id), this.ctx.stub.getPrivateDataHash(this.getImplicitPrivateDataCollection(from), id)]);
        return hash1?.length !== 0 || hash2?.length !== 0;
       
    }
    public async find(id: string): Promise<Interaction> 
    {
        return await this.getImplicit(id);
    }
    public async getIncomplete(): Promise<Interaction[]> 
    {
        return (await this.getAllImplicit()).filter(x => !x.completed)
    }
    public async getAll(): Promise<Interaction[]> 
    {
        return await this.getAllImplicit();
    }
    protected async internalSave(entities: Interaction[]): Promise<void> 
    {
        for(const entity of entities)
        {
            await Promise.all([this.savePrivate(this.getImplicitPrivateDataCollection(entity.to), entity), this.savePrivate(this.getImplicitPrivateDataCollection(entity.from), entity)]);
        }
    }


    
}