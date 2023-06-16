
import { createContainer, asClass, asValue, Lifetime, InjectionMode } from "awilix";
import { AppContract } from "./Infrastructure/Hyperledger/AppContract";
import { Serializer } from "./Infrastructure/Mapping/Serializer";
//Dependency container
export const container = createContainer({injectionMode: InjectionMode.CLASSIC})

container.register({container: asValue(container)});
container.register({serializer: asClass(Serializer).singleton()})
const path = `${__dirname}`

container.loadModules([`${path}/Infrastructure/Mapping/**/*Mapper.{js,ts}`], {formatName: "camelCase", resolverOptions: {lifetime: Lifetime.SINGLETON}})
container.loadModules([`${path}/Infrastructure/Validation/Schemas/*Schema.{js,ts}`], {resolverOptions: {lifetime: Lifetime.SINGLETON}})
container.loadModules([`${path}/Application/+(Commands|Queries|Handlers|Responses)/**/*Handler.{ts,js}`], { resolverOptions: { lifetime: Lifetime.SCOPED } });
container.loadModules([`${path}/Infrastructure/Repository/**/*Repo.{js,ts}`], {formatName: "camelCase", resolverOptions: {lifetime: Lifetime.SCOPED}})

Object.keys(container.registrations).forEach(x=> console.log(x))
AppContract.setContainer(container);
export const contracts = [AppContract]