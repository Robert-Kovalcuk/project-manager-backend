import {BodyParams, Controller, Get, Post} from "@tsed/common"
import {IAuthedRequest} from "../types/IAuthedRequest";
import {IResponse} from "../types/IResponse";
import {ClientService, IClientResult} from "../services/clientService"
import {createResponse} from "../helpers/createResponse";
import {Client} from "../entities/client";
import {Note} from "../entities/note"
import getEntityDefinitions from "../helpers/getEntityDefinitions"

@Controller("/client")
export class ClientController {
    public constructor(private clientService: ClientService) {}

    @Post("/create")
    public async create(@BodyParams() request: IAuthedRequest<Client>): Promise<IResponse<Client>> {
        return createResponse(await this.clientService.create(request.content))
    }

    @Get("/get")
    public async get(): Promise<IResponse<IClientResult>> {
        return createResponse(await this.clientService.get())
    }

    @Get("/definitions")
    public async getDefinitions(): Promise<IResponse<any>> {
        return createResponse(await getEntityDefinitions("client"))
    }
}

export interface IClient {
    id?: number
    comments?: Comment[]
    note?: Note

    from: Date
    to: Date

    name: string
    title: string
    phone: string
    email: string

    status: string
    activeLines: number
}
