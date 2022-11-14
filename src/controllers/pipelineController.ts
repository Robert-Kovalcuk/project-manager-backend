import {BodyParams, Controller, Get, Post, QueryParams} from "@tsed/common"
import {IPipelinesResult, PipelineService} from "src/services/pipelineService"
import {Pipeline} from "../entities/pipeline"
import {BadRequest, NotFound} from "@tsed/exceptions"
import {IAuthedRequest} from "../types/IAuthedRequest"
import {IResponse} from "../types/IResponse"
import {createResponse} from "../helpers/createResponse"

@Controller("/pipeline")
export class PipelineController {

    public constructor(private pipelineService: PipelineService) {}

    @Post("/create")
    public async create(@BodyParams() request: IAuthedRequest<Pipeline>): Promise<IResponse<Pipeline>> {
        if (!request.content.name || !request.content.contactPerson)
            throw new BadRequest("Missing one or more parameters")

        return createResponse(await this.pipelineService.create(request.content))
    }

    @Post("/update")
    public async update(@BodyParams() request: IAuthedRequest<Pipeline>): Promise<IResponse<boolean>> {
        return createResponse(await this.pipelineService.update(request.content))
    }

    @Get("/search")
    public async search(@QueryParams("index") index: number, @QueryParams("size") size: number, @QueryParams("sortBy") sortBy: string, @QueryParams("search") search: string): Promise<IResponse<IPipelinesResult>> {
        return this.pipelineService.search(index, size, sortBy, search).then(pipes => createResponse(pipes))
    }

    @Post("/addComment")
    public async addComment(@BodyParams() request: IAuthedRequest<{comment: string, pipelineName: string}>): Promise<IResponse<boolean>> {
        return this.pipelineService.addComment(request.content.comment, request.content.pipelineName).then(success => createResponse(success))
    }

    @Post("/addNote")
    public async addNote(@BodyParams() request: IAuthedRequest<{note: string, pipelineName: string}>): Promise<IResponse<boolean>> {
        return this.pipelineService.addNote(request.content.note, request.content.pipelineName).then(success => createResponse(success))
    }

    @Get("/definitions")
    public async getDefinitions(): Promise<IResponse<any>> {
        return createResponse(await this.pipelineService.getDefinitions())
    }

    @Post("/get")
    public async get(@BodyParams() request: IAuthedRequest<{id: number}>): Promise<IResponse<Pipeline>> {
        const pipeline = await this.pipelineService.findPipelineById(request.content.id)

        if(!pipeline)
            throw new NotFound("Pipeline with this name does not exist.")

        return createResponse(pipeline)
    }
}
