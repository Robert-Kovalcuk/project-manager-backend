import {BaseService} from "./baseService"
import { ProviderScope, ProviderType} from "@tsed/common"
import {Injectable} from "@tsed/di"
import {TypeORMService} from "@tsed/typeorm"
import {Pipeline} from "../entities/pipeline"
import {BadRequest, NotFound} from "@tsed/exceptions"
import getEntityDefinitions from "../helpers/getEntityDefinitions"

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.SINGLETON
})
export class PipelineService extends BaseService {
    public constructor(public typeORMService: TypeORMService) {
        super(typeORMService)
    }

    public async create(pipeline: Pipeline): Promise<Pipeline> {
        return this.findPipeline(pipeline.name).then(exists => {
            if(exists !== undefined)
                throw new BadRequest("Pipeline already exists.")
            else {
                let newPipeline = this.connection.manager.create(Pipeline, pipeline)

                newPipeline.name = pipeline.name
                newPipeline.address = pipeline.address
                newPipeline.city = pipeline.city
                newPipeline.contactPerson = pipeline.contactPerson
                newPipeline.country = pipeline.country
                newPipeline.status = pipeline.status
                newPipeline.note = ""
                newPipeline.comments = {
                    comments: []
                }

                return this.connection.manager.save(newPipeline)
            }
        })

    }

    public async update(pipeline: Pipeline): Promise<boolean> {
        let oldPipeline = await this.findPipeline(pipeline.name)

        if(!oldPipeline)
            throw new NotFound(`Pipeline with id of ${pipeline.id} not found.`)

        console.log(oldPipeline)

        return this.connection.manager.update(Pipeline, oldPipeline.id, {
            name: pipeline.name,
            contactPerson: pipeline.contactPerson,
            address: pipeline.address,
            city: pipeline.city,
            country: pipeline.country,
            status: pipeline.status,
            comments: {
                comments: pipeline.comments.comments
            },
            note: pipeline.note
        }).then(affected => !!affected)
    }

    public async findPipeline(name: string): Promise<Pipeline | undefined> {
        return this.connection.manager.findOne(Pipeline, {where: {name}})
    }

    public async findPipelineById(id: number): Promise<Pipeline | undefined> {
        return this.connection.manager.findOne(Pipeline, {where: {id}})
    }

    public async search(index: number, size: number, sortBy: string, search: string): Promise<IPipelinesResult> {
        const pipelines = await this.connection.manager.createQueryBuilder()
            .select("*")
            .from(Pipeline, "p")
            .where(
                "p.status like :search or" +
                " p.name like :search or" +
                " p.id like :search or" +
                " p.address like :search or" +
                " p.city like :search or" +
                " p.country like :search or" +
                " p.contactPerson like :search", {search: `%${search}%`})
            .orderBy(sortBy)
            .skip(size * (index - 1))
            .take(size)
            .execute()

        if(!pipelines)
            return {totalCount: 0, pipelines: []}

        const totalCount = await this.connection.manager.createQueryBuilder().select("*").from(Pipeline, "p").getCount()

        return {totalCount: search.length === 0 ? totalCount: pipelines.length, pipelines: pipelines}
    }

    public async getDefinitions(): Promise<any> {
        return getEntityDefinitions("pipeline")
    }

    public async addComment(comment: string, pipelineName: string): Promise<boolean> {
        let pipeline = await this.findPipeline(pipelineName)
        if(!pipeline)
            throw new NotFound(`Pipeline with name: ${pipelineName} not found.`)

        pipeline.comments.comments === null ? pipeline.comments.comments = [comment] : pipeline.comments.comments.push(comment)

        return this.update(pipeline)
    }

    public async addNote(note: string, pipelineName: string): Promise<boolean> {
        let pipeline = await this.findPipeline(pipelineName)
        if(!pipeline)
            throw new NotFound(`Pipeline with name: ${pipelineName} not found.`)

        pipeline.note = pipeline.note + ` ${note}`

        return this.update(pipeline)
    }
}

export interface IPipelinesResult {
    totalCount: number,
    pipelines: IPipeline[]
}

export interface RawDefinitionsResult {
    COLUMN_NAME: string
}

export interface IPipeline {
    name: string,
    contactPerson: string,
    address: string,
    country: string,
    city: string,
    status: EPipelineStatus,
    comments?: IComments,
    id?: number
    note?: string
}

export interface IComments {comments: string[]}

export enum EPipelineStatus {
    notStarted = "not started",
    inProgress = "in progress",
    done = "done"
}
