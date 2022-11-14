import {BodyParams, Middleware, Req} from "@tsed/common"
import {Forbidden} from "@tsed/exceptions"
import {SessionService} from "../services/sessionService"
import {Inject} from "@tsed/di"

@Middleware()
export default class sessionManagerMiddleware {
    @Inject(SessionService)
    private sessionService: SessionService

    public async use(@BodyParams() body: any, @Req() req: Req) {
        let sessionId = ""
        if(req.method === "GET")
            sessionId = req.query.sessionId as string
        else
            sessionId = req.body.sessionId

        if(req.path == "/user/login" || req.path == "/user/create")
            return

        if(!sessionId)
            throw new Forbidden("Session id missing.")

        await this.sessionService.extendSession(sessionId)
    }
}
