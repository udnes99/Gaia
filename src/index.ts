
import { createContainer, asClass, asValue, Lifetime, InjectionMode } from "awilix";
import { Serializer } from "./Infrastructure/Mapping/Serializer";
import { AbstractContract } from "./Contracts/AbstractContract";
import { ActivityContract } from "./Contracts/Activity/ActivityContract";
import { AssetContact } from "./Contracts/Asset/AssetContract";
import { InteractionContract } from "./Contracts/Interaction/InteractionContract";
import { ContractManager } from "./Infrastructure/Manager/ContractManager";

/*

! COMPOSITION ROOT

*/

//Dependency container
export const container = createContainer({injectionMode: InjectionMode.CLASSIC})

container.register({container: asValue(container)});
container.register({serializer: asClass(Serializer).singleton()})
const path = `${__dirname}`
container.loadModules([`${path}/Contracts/**/*Contract.{ts,js}`], {resolverOptions: {lifetime: Lifetime.SINGLETON}});
container.loadModules([`${path}/Infrastructure/Mapping/**/*Mapper.{js,ts}`], {formatName: "camelCase", resolverOptions: {lifetime: Lifetime.SINGLETON}})
container.loadModules([`${path}/Infrastructure/Validation/**/*Schema.{js,ts}`], {formatName: "camelCase", resolverOptions: {lifetime: Lifetime.SINGLETON}})

const manager = new ContractManager();

export const contracts = [ActivityContract, AssetContact, InteractionContract]

AbstractContract.setManager(manager);