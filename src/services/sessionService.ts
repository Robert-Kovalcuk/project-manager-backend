import {InternalServerError, NotFound} from "@tsed/exceptions"
import {Inject, Injectable} from "@tsed/di"
import {DEFAULT_CONNECTION} from "./DefaultConnection"
import {getConnection} from "typeorm"
import {Session} from "../entities/session"
import {User} from "../entities/user"
import {ProviderScope, ProviderType} from "@tsed/common"

@Injectable({
    type: ProviderType.SERVICE,
    scope: ProviderScope.SINGLETON
})
export class SessionService {
    private connection: DEFAULT_CONNECTION

    constructor(@Inject(DEFAULT_CONNECTION) connection: DEFAULT_CONNECTION) {
        this.connection = connection
    }

    public create(userId: number): Promise<Session> {
        const session = new Session()
        session.userId = userId

        return this.connection.manager.save(session)
    }

    public async userFromSessionGuid(sessionGuid: string): Promise<User> {
        return await this.getUserFromSession(await this.getSession(sessionGuid))
    }

    private async getUserFromSession(session: Session): Promise<User> {
        const user = await this.connection.manager.findOne(User, {where: {id: session.userId}})

        if(!user)
            throw new InternalServerError(  `Could not find user with given user ID (${session.userId}) provided by session. This error is more likely to be server problem.`)

        return user
    }

    public async getSession(sessionGuid: string): Promise<Session> {
        const session = await SessionService.findSession(sessionGuid)

        if(!session)
            throw new NotFound("Session expired or does not exist.")

        return session
    }

    private static async findSession(guid: string): Promise<Session | undefined> {
        return getConnection()
            .createQueryBuilder()
            .select("session")
            .from(Session, "session")
            .where("session.guid = :guid", {
                guid: guid
            })
            .andWhere("session.expires > :now", {
                now: new Date()
            })
            .getOne()
    }

    public async extendSession(guid: string): Promise<void> {
        await getConnection().createQueryBuilder()
            .update(Session)
            .set({
                expires: SessionService.nowPlusOneHour()
            })
            .where("guid = :guid", {
                guid: await this.getSession(guid).then(s => s.guid)
            })
            .execute()
    }

    private static nowPlusOneHour(): Date {
        const extendedExpirationDate = new Date()
        extendedExpirationDate.setHours(extendedExpirationDate.getHours() + 1)

        return extendedExpirationDate
    }
}
