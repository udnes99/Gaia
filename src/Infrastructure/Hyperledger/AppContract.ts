import { asValue, AwilixContainer } from "awilix";
import { Context, Contract } from "fabric-contract-api";
import { ICommand } from "../../Application/Commands/ICommand";
import { ICommandHandler } from "../../Application/Commands/ICommandHandler";
import { IQueryHandler } from "../../Application/Queries/IQueryHandler";


export class AppContract extends Contract
{
    private static container : AwilixContainer


    public static setContainer(container : AwilixContainer)
    {
        AppContract.container = container;
    }

    constructor
    () {super("Gaia")};

    public async executeQuery(ctx: Context, query: string, payload: string)
    {
        if(!query)
            throw new Error("Query not specified.");

        ctx.logging.getLogger().info("Executing query " + query)
        const executionScope = AppContract.container.createScope();
        executionScope.register({container: asValue(executionScope)});
        executionScope.register({ctx: asValue(ctx)});
        executionScope.register({context: asValue({organization: ctx.clientIdentity.getMSPID()})})

        const queryHandler : IQueryHandler<ICommand<unknown>, unknown> = executionScope.resolve(query.concat("QueryHandler"), {allowUnregistered: true});
        if(!queryHandler)
            throw new Error("Unknown query " +  query)
        payload = payload !== "" ? JSON.parse(payload) :  {};
        return await queryHandler.handle(<ICommand<unknown>>payload);  
    }

    public async executeCommand(ctx: Context)
    {
       
        const transientMap = ctx.stub.getTransient();
        if(ctx.stub.getArgs().length > 1)
            throw new Error("Arguments for commands must be specified in transient data.");
        
        if(!transientMap.has("command"))
            throw new Error("Command not specified.");
        
        const command = Buffer.from(transientMap.get("command")).toString("utf-8");
        const executionScope = AppContract.container.createScope();
        executionScope.register({container: asValue(executionScope)});
        executionScope.register({ctx: asValue(ctx)});
        executionScope.register({context: asValue({organization: ctx.clientIdentity.getMSPID()})})
        const commandHandler : ICommandHandler<ICommand<unknown>, unknown> = executionScope.resolve(command.concat("CommandHandler"), {allowUnregistered: true});
        if(!commandHandler)
            throw new Error("Unknown command " +  command)
        ctx.logging.getLogger().info("Executing command " + command)
        const payload : unknown =  transientMap.has("payload") ? JSON.parse(Buffer.from(transientMap.get("payload")).toString("utf-8")) : {};
        return await commandHandler.handle(<ICommand<unknown>>payload);
    }
}