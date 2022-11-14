import {ProviderScope, ProviderType} from "@tsed/common"
import {BaseService} from "./baseService"
import {Injectable} from "@tsed/di"
import {TypeORMService} from "@tsed/typeorm"
import {User} from "../entities/user"
import {Project} from "../entities/project"
import {NotFound} from "@tsed/exceptions"

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.SINGLETON
})
export class UserService extends BaseService {

    public constructor(typeORMService: TypeORMService) {
        super(typeORMService)
    }

    public async create(email: string, password: string): Promise<User> {
        let user = new User()
        user.email = email
        user.password = password
        user.projects = []
        await this.connection.manager.save(user)

        return user
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.connection.manager.findOne(User, {where: {email}})
    }

    public async findById(id: number): Promise<User | undefined> {
        return this.connection.manager.findOne(User, {where: {id}})
    }

    public async deleteById(id: number): Promise<boolean> {
        const user = await this.findById(id)

        if(!user)
            throw new NotFound("User not found.")

        const isDeleteSuccess = await this.connection.manager.delete(User, {id: user.id}).then(result => result.affected)

        return !!isDeleteSuccess
    }

}
