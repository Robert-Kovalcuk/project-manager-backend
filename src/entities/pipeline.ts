import {Column, Entity} from "typeorm"
import {MaxLength, Property, Required} from "@tsed/schema"
import {Comment} from "./comment"
import {BaseEntity} from "./baseEntity"

@Entity()
export class Pipeline extends BaseEntity {
    @Column({
        unique: true,
    })
    @Required()
    @MaxLength(100)
    public name: string

    @Column()
    @Required()
    @MaxLength(50)
    public contactPerson: string

    @Column( {
        nullable: true,
        type: "text"
    })
    @Required()
    @MaxLength(100)
    public address: string | null

    @Column( {
        nullable: true,
        type: "text"
    })
    @Required()
    @MaxLength(25)
    public city: string | null

    @Column( {
        nullable: true,
        type: "text"
    })
    @MaxLength(25)
    @Required()
    public country: string | null

    @Column( {
        nullable: true,
        type: "text"
    })
    @MaxLength(25)
    @Required()
    public status: string | null

    @Property()
    @Column(() => Comment)
    comments: Comment

    @Property()
    @Column()
    note: string
}

