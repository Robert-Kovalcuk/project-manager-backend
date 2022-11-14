import {BodyParams, Controller, Post} from "@tsed/common"
import {BadRequest} from "@tsed/exceptions"
import {getConnection} from "typeorm"
import {ProjectService} from "../services/projectService"
import {Project} from "../entities/project"
import {User} from "../entities/user"
import {IResponse} from "../types/IResponse"
import {createResponse} from "../helpers/createResponse"
import {IAuthedRequest} from "../types/IAuthedRequest"

@Controller("/project")
export class ProjectController {

    public constructor(public projectService: ProjectService) {}

    @Post("/create")
    public async create(@BodyParams() request: IAuthedRequest<Project>): Promise<IResponse<Project>> {
        const {name, category, admin} = request.content

        if(!name || !category || !admin)
            throw new BadRequest("Missing one or more parameters.")

        const [user] = await getConnection()
            .createEntityManager()
            .findByIds(User, [14])

        return createResponse(await this.projectService.create(request.content))
    }

    @Post("/update")
    public async update(@BodyParams() project: Project): Promise<void> {
        return this.projectService.update(project)
    }
}
