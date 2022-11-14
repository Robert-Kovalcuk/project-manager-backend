import {PrimaryGeneratedColumn} from "typeorm"
import {Property} from "@tsed/schema"

export class BaseEntity {
    @Property()
    @PrimaryGeneratedColumn()
    id: number
}
