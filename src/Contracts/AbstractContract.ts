import { Context, Contract } from "fabric-contract-api";
import { IContractManager } from "./IContractManager";
import { ISerializer } from "./Serializer/ISerializer";

export abstract class AbstractContract extends Contract
{
    protected serializer : ISerializer;

    private static manager : IContractManager;


    public setSerializer(serializer : ISerializer)
    {
        this.serializer = serializer;
    }

    constructor
    (name: string)
    {
        super(name)
        const contractMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(this)));
        for(const prop of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
        {
            if(prop === "constructor" || contractMethods.includes(prop) || typeof this[prop] !== "function")
                continue;
            const method = this[prop].bind(this);
            const methodBody = this[prop].toString();
            const args = methodBody.substring(methodBody.indexOf("(") + 1, methodBody.indexOf(")")).replaceAll(" ", "").split(",")
            if(args.length === 1) //No additional arguments expected
                continue;
            this[prop] = (ctx: Context, argument: unknown) => 
            {
                if(argument === undefined)
                    return method(ctx); 
                if(typeof argument !== "string")
                    return method(ctx, argument);
                else
                {
                    if(!argument)
                    {
                        const transientMap = ctx.stub.getTransient();
                        if(!transientMap.has("payload"))
                            throw new Error("No argument was provided")
                        argument = Buffer.from(transientMap.get("payload")).toString("utf-8");
                    }
                    const type = args[1].charAt(0).toUpperCase() + args[1].slice(1)
                    if(this.serializer.isKnownType(type))
                        return method(ctx, this.serializer.deserializeJSON(type, argument as string));
                    else
                        return method(ctx, argument);
                }
               
            }
        }
        AbstractContract.manager.configure(this);
    }

    public static setManager(manager: IContractManager)
    {
        this.manager = manager;
    }

    
}