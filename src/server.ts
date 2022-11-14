import "@tsed/ajv"
import "@tsed/typeorm"
import "@tsed/platform-express" // /!\ keep this import
import {Configuration, Inject} from "@tsed/di"
import {config, rootDir} from "./config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compress from "compression"
import cors from "cors"
import {PlatformApplication} from "@tsed/common"
import methodOverride from "method-override"
import sessionManagerMiddleware from "./middlewares/SessionManagerMiddleware"

@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE
    mount: {
        "/": [
            `${rootDir}/controllers/**/*.ts`
        ]
    },
    views: {
        root: `${rootDir}/views`,
        extensions: {
            ejs: "ejs"
        }
    },
    exclude: [
        "**/*.spec.ts"
    ],

})
export class Server {
    @Inject()
    app: PlatformApplication;

    @Configuration()
    settings: Configuration;

    $beforeRoutesInit(): void {
        this.app.getApp().set("trust proxy", 1)
        this.app
            .use(cors())
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(sessionManagerMiddleware)
    }
}
