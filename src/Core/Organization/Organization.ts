import { OrganizationId } from "./OrganizationId";

export class Organization
{
    constructor
    (
        readonly id: OrganizationId,
        readonly name: string,
        readonly country: string,
    ) {}
}