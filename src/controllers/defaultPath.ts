import {Controller, UseBeforeEach} from "@tsed/common"
import sessionManagerMiddleware from "../middlewares/SessionManagerMiddleware"

@Controller("/")
@UseBeforeEach(sessionManagerMiddleware)
export class DefaultPath {}