import {Connection} from "typeorm"
import {TypeORMService} from "@tsed/typeorm"

export class BaseService {
    public connection: Connection

    public constructor(public typeORMService: TypeORMService) {
    }

    public $afterRoutesInit(): void | Promise<any> {
        this.connection = this.typeORMService.get("default")
    }
}