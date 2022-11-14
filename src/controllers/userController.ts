import * as bcrypt from "bcrypt"
import {BodyParams, Controller, Get, PathParams, Post, QueryParams, Req} from "@tsed/common"
import {BadRequest, Forbidden, InternalServerError, NotFound} from "@tsed/exceptions"
import {SessionService} from "../services/sessionService"
import {UserService} from "../services/userService"
import {User} from "../entities/user"
import  {IAuthedRequest, IBaseRequest} from "../types/IAuthedRequest"
import {IResponse} from "../types/IResponse"
import {createResponse} from "../helpers/createResponse"

@Controller("/user")
export class UserController {
    public constructor(private userService: UserService, private sessionService: SessionService) {}

    @Post("/create")
    public create(@BodyParams() request: IBaseRequest<User>): Promise<IResponse<User>> {
        if(!request.content)
            throw new BadRequest("Wrong parameters.")

        return this.userService.create(request.content.email, request.content.password).then(user => createResponse(user))
    }

    @Post("/login")
    public async login(@Req() req: Req, @BodyParams() request: IBaseRequest<ILoginRegisterRequest>) : Promise<IResponse<IUserCreationResponse>> {
        const {email, password} = request.content

        if(!email || !password)
            throw new BadRequest("Missing one or more parameters.")

        const user = await this.userService.findByEmail(email)

        if(!user)
            throw new NotFound("User doesn't exist.")

        if(await bcrypt.compare(password, user.password)) {

            return this.sessionService.create(user.id).then(session => {
                return createResponse({
                    sessionId: session.guid,
                    user: {
                        userId: user.id,
                        email: user.email
                    }
                })
            })
        }

        throw new Forbidden("Wrong credentials.")
    }

    @Post("/delete")
    public async delete(@BodyParams() request: IAuthedRequest<{userId: number}>): Promise<IResponse<IWasSuccess>> {
        const userId = request.content.userId

        if(await this.userService.deleteById(userId))
            return createResponse({wasSuccess: true})

        throw new InternalServerError("Something went wrong deleting the user.")
    }

    @Get("/me")
    public async me(@QueryParams() query: any): Promise<IResponse<User>> {
        const {sessionId} = query
        return createResponse(await this.sessionService.userFromSessionGuid(sessionId))
    }
}

export interface ILoginRegisterRequest {
    email: string,
    password: string
}

export interface IWasSuccess {
    wasSuccess: boolean
}

export interface IUserCreationResponse {
    sessionId: string,
    user: {
        userId: number,
        email: string
    }
}
