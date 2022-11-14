import { ProviderScope, ProviderType} from "@tsed/common"
import {BaseService} from "./baseService"
import {Injectable} from "@tsed/di"
import {Project} from "../entities/project"
import {TypeORMService} from "@tsed/typeorm"
import {User} from "../entities/user"
import {BadRequest, InternalServerError} from "@tsed/exceptions"

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.SINGLETON
})
export class ProjectService extends BaseService {

    public constructor(public typeORMService: TypeORMService) {
        super(typeORMService)
    }

    public create(project: Project): Promise<Project> {
        const newProject = new Project()

        newProject.admin = project.admin
        newProject.name = project.name
        newProject.category = project.category
        newProject.status = project.status
        newProject.totalCost = project.totalCost
        newProject.deadline = project.deadline

        return this.connection.manager.save(newProject)
    }

    public findById(projectId: string | number): Promise<Project | undefined> {
        return this.connection.manager.findOne(Project, {where: {projectId}})
    }

    public async update(project: Project): Promise<void> {
        const oldProject = await this.findById(project.id)

        if(!oldProject)
            throw new BadRequest(`Project with this id ${project.id} does not exist.`)

        this.connection.manager.update(Project, oldProject.id, {
            admin: project.admin,
            category: project.category,
            deadline: project.deadline,
            name: project.name,
            status: project.status,
            totalCost: project.totalCost
        }).then()
    }
}
