export interface PrimitiveObject
{
    [index: string] : PrimitiveField;
}
export type PrimitiveField = number | null | boolean | string | PrimitiveObject | PrimitiveField[] | undefined

export const atomicTypes = ["number", "boolean", "string", "undefined", "null"];

export function isValidPrimitive(field: PrimitiveField) : boolean
{
    const type = typeof field;
    if(type == 'object')
    {
        if(Array.isArray(field))
            return field.every(x => isValidPrimitive(x));
        if((<PrimitiveObject>field).constructor.name !== 'Object')
            return false;
        for(const key in <PrimitiveObject>field)
        {
            if(typeof key !== 'string')
                return false;
            if(!isValidPrimitive((<PrimitiveObject>field)[key]))
                return false;
        }
        return true;
    }
    return atomicTypes.includes(type);
}