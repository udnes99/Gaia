import { ActivityId } from "../../../Core/Activity/ActivityId";
import { AssetId } from "../../../Core/Asset/AssetId";
import { Consumption } from "../../../Core/Asset/Consumption";
import { OutcomeDTO } from "../../../Infrastructure/Mapping/Outcome/OutcomeMapper";
import { OneOrMany } from "../../../Types/OneOrMany";
import { PrimitiveField } from "../../../Types/PrimitiveField";
import { ICommand } from "../ICommand";

export class RegisterActivityCommand implements ICommand<void>
{
    constructor
    (
        readonly id: string,
        readonly type: string,
        readonly outcome: OneOrMany<OutcomeDTO>,
        readonly assets?: 
        {
            readonly produced?: 
            {
                readonly id: string,
                readonly type: string,
                readonly fractional: boolean,
                readonly composedOf?: Record<string, number>,
            }[],
            readonly consumed?: Record<AssetId, Consumption>,
            readonly involved?: AssetId[]
        },
        readonly description?: string,
        readonly data?: Record<string, PrimitiveField>,
        readonly activities?: ActivityId[]
    ) {}
}