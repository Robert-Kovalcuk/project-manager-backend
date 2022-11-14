import {Injectable} from "@tsed/di";
import {ProviderScope, ProviderType} from "@tsed/common";
import {BaseService} from "./baseService";
import {TypeORMService} from "@tsed/typeorm";
import {Client} from "../entities/client";
import {BadRequest} from "@tsed/exceptions"
import {RawDefinitionsResult} from "./pipelineService"
import getEntityDefinitions from "../helpers/getEntityDefinitions"

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.SINGLETON
})
export class ClientService extends BaseService {
    public constructor(public typeORMService: TypeORMService) {
        super(typeORMService)
    }

    public async create(client: Client): Promise<Client> {
        return this.findPipeline(client.name).then(exists => {
            if(exists !== undefined)
                throw new BadRequest("Client already exists.")
            else {
                let newClient = new Client()

                newClient.name = client.name
                newClient.title = client.title
                newClient.activeLines = client.activeLines
                newClient.from = client.from
                newClient.to = client.to
                newClient.status = client.status
                newClient.email = client.email
                newClient.phone = client.phone
                newClient.note = {
                    note: ""
                }

                return this.connection.manager.save(newClient)
            }
        })
    }

    public async get(): Promise<IClientResult> {
        const clients = await this.connection.manager.createQueryBuilder().select("*").from(Client, "c").execute()
        const totalCount = await this.connection.manager.createQueryBuilder().select("*").from(Client, "c").getCount()

        return {
            clients: clients,
            totalCount: totalCount
        }
    }

    public async getDefinitions(): Promise<any> {
        return getEntityDefinitions("client")
    }

    public async findPipeline(name: string): Promise<Client | undefined> {
        return this.connection.manager.findOne(Client, {where: {name}})
    }
}

export interface IClientResult {
    totalCount: number,
    clients: Client[]
}
