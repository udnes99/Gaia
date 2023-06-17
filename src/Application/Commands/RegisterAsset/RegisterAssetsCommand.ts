import { PrimitiveObject } from "../../../Types/PrimitiveField";
import { ICommand } from "../ICommand";

export class RegisterAssetCommand implements ICommand<void>
{
    constructor
    (
        readonly assets: 
        {
            readonly id: string,
            readonly type: string,
            readonly fractional: boolean,
            readonly activities?: 
            {
                readonly activity: string,
                readonly production?: boolean,
                readonly consumption?: number | boolean
            }[],
            readonly previousOwner?: string,
            readonly composedOf?: Record<string, number>,
            readonly data?: PrimitiveObject
        }[]
    ) {}
}